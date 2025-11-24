-- Fix search_path for security
DROP FUNCTION IF EXISTS check_daily_scan_limit(UUID, UUID, INTEGER);
DROP FUNCTION IF EXISTS check_weekly_scan_limit(UUID, UUID, INTEGER);

-- Recreate with proper search_path
CREATE OR REPLACE FUNCTION check_daily_scan_limit(
  p_customer_id UUID,
  p_business_id UUID,
  p_max_scans_per_day INTEGER DEFAULT 10
)
RETURNS BOOLEAN AS $$
DECLARE
  scan_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO scan_count
  FROM stamp_transactions
  WHERE customer_id = p_customer_id
    AND business_id = p_business_id
    AND scanned_at > NOW() - INTERVAL '24 hours';
  
  RETURN scan_count < p_max_scans_per_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION check_weekly_scan_limit(
  p_customer_id UUID,
  p_business_id UUID,
  p_max_scans_per_week INTEGER DEFAULT 50
)
RETURNS BOOLEAN AS $$
DECLARE
  scan_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO scan_count
  FROM stamp_transactions
  WHERE customer_id = p_customer_id
    AND business_id = p_business_id
    AND scanned_at > NOW() - INTERVAL '7 days';
  
  RETURN scan_count < p_max_scans_per_week;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;