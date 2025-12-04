-- Create customer_memberships table to track customer-business relationships
CREATE TABLE public.customer_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL,
  business_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true,
  total_stamps_earned integer DEFAULT 0,
  total_rewards_redeemed integer DEFAULT 0,
  last_visit_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (customer_id, business_id)
);

-- Enable RLS
ALTER TABLE public.customer_memberships ENABLE ROW LEVEL SECURITY;

-- Customers can view their own memberships
CREATE POLICY "Customers can view their own memberships"
ON public.customer_memberships
FOR SELECT
USING (auth.uid() = customer_id);

-- Business owners can view memberships for their business
CREATE POLICY "Business owners can view memberships for their business"
ON public.customer_memberships
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM businesses
  WHERE businesses.id = customer_memberships.business_id
  AND businesses.owner_id = auth.uid()
));

-- System can insert memberships (via triggers/functions)
CREATE POLICY "Customers can create their own memberships"
ON public.customer_memberships
FOR INSERT
WITH CHECK (auth.uid() = customer_id);

-- System can update memberships
CREATE POLICY "System can update memberships"
ON public.customer_memberships
FOR UPDATE
USING (auth.uid() = customer_id OR EXISTS (
  SELECT 1 FROM businesses
  WHERE businesses.id = customer_memberships.business_id
  AND businesses.owner_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_customer_memberships_updated_at
BEFORE UPDATE ON public.customer_memberships
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to auto-create membership on first stamp
CREATE OR REPLACE FUNCTION public.handle_new_stamp_card()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.customer_memberships (customer_id, business_id, joined_at)
  VALUES (NEW.customer_id, NEW.business_id, NOW())
  ON CONFLICT (customer_id, business_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create membership when stamp card is created
CREATE TRIGGER on_stamp_card_created
AFTER INSERT ON public.stamp_cards
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_stamp_card();

-- Populate existing memberships from stamp_cards
INSERT INTO public.customer_memberships (customer_id, business_id, joined_at, total_stamps_earned)
SELECT DISTINCT 
  sc.customer_id,
  sc.business_id,
  MIN(sc.created_at) as joined_at,
  SUM(sc.stamps_collected) as total_stamps_earned
FROM stamp_cards sc
GROUP BY sc.customer_id, sc.business_id
ON CONFLICT (customer_id, business_id) DO NOTHING;

-- Update total_rewards_redeemed from existing data
UPDATE customer_memberships cm
SET total_rewards_redeemed = (
  SELECT COUNT(*) FROM rewards_redeemed rr
  WHERE rr.customer_id = cm.customer_id
  AND rr.business_id = cm.business_id
  AND rr.is_redeemed = true
);

-- Add indexes for performance
CREATE INDEX idx_customer_memberships_customer ON public.customer_memberships(customer_id);
CREATE INDEX idx_customer_memberships_business ON public.customer_memberships(business_id);