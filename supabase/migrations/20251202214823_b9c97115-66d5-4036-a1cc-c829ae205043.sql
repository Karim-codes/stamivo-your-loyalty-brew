-- Add redemption mode settings to loyalty_programs
ALTER TABLE public.loyalty_programs
ADD COLUMN IF NOT EXISTS redemption_mode text NOT NULL DEFAULT 'both' CHECK (redemption_mode IN ('qr_only', 'pin_only', 'both')),
ADD COLUMN IF NOT EXISTS qr_expiry_seconds integer NOT NULL DEFAULT 30,
ADD COLUMN IF NOT EXISTS pin_expiry_seconds integer NOT NULL DEFAULT 120,
ADD COLUMN IF NOT EXISTS max_failed_attempts integer NOT NULL DEFAULT 5,
ADD COLUMN IF NOT EXISTS lockout_duration_minutes integer NOT NULL DEFAULT 15;

-- Add enhanced redemption tracking columns to rewards_redeemed
ALTER TABLE public.rewards_redeemed
ADD COLUMN IF NOT EXISTS qr_token text,
ADD COLUMN IF NOT EXISTS pin_code text,
ADD COLUMN IF NOT EXISTS qr_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS pin_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS lockout_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_failed_at timestamp with time zone;

-- Create index for fast QR token lookup
CREATE INDEX IF NOT EXISTS idx_rewards_redeemed_qr_token ON public.rewards_redeemed(qr_token) WHERE qr_token IS NOT NULL;

-- Create index for fast PIN lookup
CREATE INDEX IF NOT EXISTS idx_rewards_redeemed_pin_code ON public.rewards_redeemed(pin_code) WHERE pin_code IS NOT NULL;