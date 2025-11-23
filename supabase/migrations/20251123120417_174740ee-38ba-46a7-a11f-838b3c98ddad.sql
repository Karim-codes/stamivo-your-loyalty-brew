-- Create enums
CREATE TYPE public.app_role AS ENUM ('customer', 'business', 'admin');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'verified', 'rejected');

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. USER_ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- 3. BUSINESSES TABLE
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  business_size TEXT,
  daily_customers INTEGER,
  had_previous_loyalty BOOLEAN DEFAULT false,
  address TEXT,
  logo_url TEXT,
  opening_hours JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Public businesses are viewable by everyone"
  ON public.businesses FOR SELECT
  USING (is_public = true);

CREATE POLICY "Business owners can view their own business"
  ON public.businesses FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can update their own business"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can insert businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- 4. LOYALTY_PROGRAMS TABLE
CREATE TABLE public.loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  stamps_required INTEGER DEFAULT 5 NOT NULL CHECK (stamps_required > 0),
  reward_description TEXT NOT NULL,
  reward_type TEXT NOT NULL,
  coffee_types TEXT[],
  allow_multiple_scans BOOLEAN DEFAULT false,
  auto_verify BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(business_id)
);

ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loyalty_programs
CREATE POLICY "Active loyalty programs are viewable by everyone"
  ON public.loyalty_programs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Business owners can manage their loyalty program"
  ON public.loyalty_programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = loyalty_programs.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

-- 5. MENU_ITEMS TABLE
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  category TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_reward_eligible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menu_items
CREATE POLICY "Menu items are viewable by everyone"
  ON public.menu_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = menu_items.business_id
        AND businesses.is_public = true
    )
  );

CREATE POLICY "Business owners can manage their menu items"
  ON public.menu_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = menu_items.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

-- Index for menu_items
CREATE INDEX idx_menu_items_business_id ON public.menu_items(business_id);
CREATE INDEX idx_menu_items_display_order ON public.menu_items(business_id, display_order);

-- 6. STAMP_CARDS TABLE
CREATE TABLE public.stamp_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  stamps_collected INTEGER DEFAULT 0 NOT NULL CHECK (stamps_collected >= 0),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(customer_id, business_id, is_completed)
);

ALTER TABLE public.stamp_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stamp_cards
CREATE POLICY "Customers can view their own stamp cards"
  ON public.stamp_cards FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert their own stamp cards"
  ON public.stamp_cards FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own stamp cards"
  ON public.stamp_cards FOR UPDATE
  USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can view stamp cards for their business"
  ON public.stamp_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = stamp_cards.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

-- Indexes for stamp_cards
CREATE INDEX idx_stamp_cards_customer_id ON public.stamp_cards(customer_id);
CREATE INDEX idx_stamp_cards_business_id ON public.stamp_cards(business_id);
CREATE INDEX idx_stamp_cards_completed ON public.stamp_cards(customer_id, is_completed);

-- 7. STAMP_TRANSACTIONS TABLE
CREATE TABLE public.stamp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stamp_card_id UUID REFERENCES public.stamp_cards(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  verified_by UUID REFERENCES public.profiles(id),
  status public.transaction_status DEFAULT 'verified' NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.stamp_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stamp_transactions
CREATE POLICY "Customers can view their own transactions"
  ON public.stamp_transactions FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can view transactions for their business"
  ON public.stamp_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = stamp_transactions.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can create transactions for their business"
  ON public.stamp_transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = stamp_transactions.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

-- Indexes for stamp_transactions
CREATE INDEX idx_stamp_transactions_customer_id ON public.stamp_transactions(customer_id);
CREATE INDEX idx_stamp_transactions_business_id ON public.stamp_transactions(business_id);
CREATE INDEX idx_stamp_transactions_stamp_card_id ON public.stamp_transactions(stamp_card_id);

-- 8. REWARDS_REDEEMED TABLE
CREATE TABLE public.rewards_redeemed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stamp_card_id UUID REFERENCES public.stamp_cards(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  redemption_code TEXT NOT NULL,
  code_generated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  code_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  failed_attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.rewards_redeemed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rewards_redeemed
CREATE POLICY "Customers can view their own redeemed rewards"
  ON public.rewards_redeemed FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create redemption codes"
  ON public.rewards_redeemed FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Business owners can view redemptions for their business"
  ON public.rewards_redeemed FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = rewards_redeemed.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can update redemptions for their business"
  ON public.rewards_redeemed FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = rewards_redeemed.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

-- Indexes for rewards_redeemed
CREATE INDEX idx_rewards_redeemed_customer_id ON public.rewards_redeemed(customer_id);
CREATE INDEX idx_rewards_redeemed_business_id ON public.rewards_redeemed(business_id);
CREATE INDEX idx_rewards_redeemed_code ON public.rewards_redeemed(redemption_code);
CREATE INDEX idx_rewards_redeemed_expires_at ON public.rewards_redeemed(code_expires_at);

-- Trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_businesses
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_loyalty_programs
  BEFORE UPDATE ON public.loyalty_programs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_menu_items
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_stamp_cards
  BEFORE UPDATE ON public.stamp_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();