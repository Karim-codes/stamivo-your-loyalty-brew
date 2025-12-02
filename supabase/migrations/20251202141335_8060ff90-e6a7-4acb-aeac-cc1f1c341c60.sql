-- Add new configurable columns to loyalty_programs
ALTER TABLE public.loyalty_programs
ADD COLUMN IF NOT EXISTS min_scan_interval_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS max_scans_per_day INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS require_open_hours BOOLEAN DEFAULT false;

-- Create function to validate and award stamp atomically
CREATE OR REPLACE FUNCTION public.validate_and_award_stamp(
  p_customer_id UUID,
  p_business_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_loyalty_program RECORD;
  v_business RECORD;
  v_stamp_card RECORD;
  v_last_scan TIMESTAMP WITH TIME ZONE;
  v_daily_count INTEGER;
  v_current_hour INTEGER;
  v_current_day TEXT;
  v_opening_hours JSONB;
  v_day_hours JSONB;
  v_is_open BOOLEAN;
  v_new_stamp_count INTEGER;
  v_stamps_required INTEGER;
  v_is_completed BOOLEAN;
BEGIN
  -- Get loyalty program settings
  SELECT * INTO v_loyalty_program
  FROM loyalty_programs
  WHERE business_id = p_business_id AND is_active = true
  LIMIT 1;

  IF v_loyalty_program IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'NO_ACTIVE_PROGRAM', 'message', 'No active loyalty program found');
  END IF;

  -- Get business details
  SELECT * INTO v_business
  FROM businesses
  WHERE id = p_business_id;

  IF v_business IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_BUSINESS', 'message', 'Business not found');
  END IF;

  -- Check opening hours if required
  IF v_loyalty_program.require_open_hours AND v_business.opening_hours IS NOT NULL THEN
    v_current_hour := EXTRACT(HOUR FROM NOW());
    v_current_day := LOWER(TO_CHAR(NOW(), 'Day'));
    v_current_day := TRIM(v_current_day);
    v_opening_hours := v_business.opening_hours;
    v_day_hours := v_opening_hours->v_current_day;
    
    IF v_day_hours IS NOT NULL AND (v_day_hours->>'closed')::boolean = true THEN
      RETURN jsonb_build_object('success', false, 'error', 'SHOP_CLOSED', 'message', 'Shop is currently closed');
    END IF;
    
    -- Simple hour check (could be enhanced for more precise time validation)
    IF v_day_hours IS NOT NULL THEN
      v_is_open := v_current_hour >= COALESCE((v_day_hours->>'open')::integer, 0) 
                   AND v_current_hour < COALESCE((v_day_hours->>'close')::integer, 24);
      IF NOT v_is_open THEN
        RETURN jsonb_build_object('success', false, 'error', 'OUTSIDE_HOURS', 'message', 'Stamps can only be collected during opening hours');
      END IF;
    END IF;
  END IF;

  -- Check minimum scan interval
  SELECT MAX(scanned_at) INTO v_last_scan
  FROM stamp_transactions
  WHERE customer_id = p_customer_id
    AND business_id = p_business_id;

  IF v_last_scan IS NOT NULL AND 
     v_last_scan > NOW() - (v_loyalty_program.min_scan_interval_minutes || ' minutes')::INTERVAL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'TOO_SOON', 
      'message', 'Please wait before scanning again',
      'wait_minutes', EXTRACT(EPOCH FROM (v_last_scan + (v_loyalty_program.min_scan_interval_minutes || ' minutes')::INTERVAL - NOW())) / 60
    );
  END IF;

  -- Check daily scan limit
  SELECT COUNT(*) INTO v_daily_count
  FROM stamp_transactions
  WHERE customer_id = p_customer_id
    AND business_id = p_business_id
    AND scanned_at > NOW() - INTERVAL '24 hours';

  IF v_daily_count >= v_loyalty_program.max_scans_per_day THEN
    RETURN jsonb_build_object('success', false, 'error', 'DAILY_LIMIT', 'message', 'Daily stamp limit reached');
  END IF;

  -- Get or create stamp card
  SELECT * INTO v_stamp_card
  FROM stamp_cards
  WHERE customer_id = p_customer_id
    AND business_id = p_business_id
    AND is_completed = false
  LIMIT 1;

  IF v_stamp_card IS NULL THEN
    INSERT INTO stamp_cards (customer_id, business_id, stamps_collected)
    VALUES (p_customer_id, p_business_id, 0)
    RETURNING * INTO v_stamp_card;
  END IF;

  v_stamps_required := v_loyalty_program.stamps_required;
  v_new_stamp_count := v_stamp_card.stamps_collected + 1;
  v_is_completed := v_new_stamp_count >= v_stamps_required;

  -- If auto_verify is true, award stamp immediately
  IF v_loyalty_program.auto_verify THEN
    -- Update stamp card
    UPDATE stamp_cards
    SET stamps_collected = v_new_stamp_count,
        is_completed = v_is_completed,
        completed_at = CASE WHEN v_is_completed THEN NOW() ELSE NULL END,
        updated_at = NOW()
    WHERE id = v_stamp_card.id;

    -- Insert verified transaction
    INSERT INTO stamp_transactions (customer_id, business_id, stamp_card_id, status, scanned_at)
    VALUES (p_customer_id, p_business_id, v_stamp_card.id, 'verified', NOW());

    RETURN jsonb_build_object(
      'success', true,
      'status', 'verified',
      'stamps_collected', v_new_stamp_count,
      'stamps_required', v_stamps_required,
      'is_completed', v_is_completed,
      'message', CASE WHEN v_is_completed THEN 'Congratulations! You earned a reward!' ELSE 'Stamp collected!' END
    );
  ELSE
    -- Insert pending transaction (requires staff approval)
    INSERT INTO stamp_transactions (customer_id, business_id, stamp_card_id, status, scanned_at)
    VALUES (p_customer_id, p_business_id, v_stamp_card.id, 'pending', NOW());

    RETURN jsonb_build_object(
      'success', true,
      'status', 'pending',
      'stamps_collected', v_stamp_card.stamps_collected,
      'stamps_required', v_stamps_required,
      'is_completed', false,
      'message', 'Scan submitted - waiting for staff approval'
    );
  END IF;
END;
$$;