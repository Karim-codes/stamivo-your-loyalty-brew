-- Add function to check daily scan limit
CREATE OR REPLACE FUNCTION check_daily_scan_limit(
  p_customer_id UUID,
  p_business_id UUID,
  p_max_scans_per_day INTEGER DEFAULT 10
)
RETURNS BOOLEAN AS $$
DECLARE
  scan_count INTEGER;
BEGIN
  -- Count scans in the last 24 hours
  SELECT COUNT(*)
  INTO scan_count
  FROM stamp_transactions
  WHERE customer_id = p_customer_id
    AND business_id = p_business_id
    AND scanned_at > NOW() - INTERVAL '24 hours';
  
  RETURN scan_count < p_max_scans_per_day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to check weekly scan limit
CREATE OR REPLACE FUNCTION check_weekly_scan_limit(
  p_customer_id UUID,
  p_business_id UUID,
  p_max_scans_per_week INTEGER DEFAULT 50
)
RETURNS BOOLEAN AS $$
DECLARE
  scan_count INTEGER;
BEGIN
  -- Count scans in the last 7 days
  SELECT COUNT(*)
  INTO scan_count
  FROM stamp_transactions
  WHERE customer_id = p_customer_id
    AND business_id = p_business_id
    AND scanned_at > NOW() - INTERVAL '7 days';
  
  RETURN scan_count < p_max_scans_per_week;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;