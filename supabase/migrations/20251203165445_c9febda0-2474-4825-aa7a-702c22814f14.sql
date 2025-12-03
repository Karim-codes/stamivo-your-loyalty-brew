-- Cleanup duplicate businesses for kemo.a.1000@gmail.com
-- Keep only "brew and ben" (001aaa8b-9ad8-45d3-8b61-c1a017abbbcc)
-- Delete the 3 "karimka" duplicates

-- Step 1: Delete menu_items for duplicate businesses
DELETE FROM menu_items 
WHERE business_id IN (
  '49c4ce0a-7ebd-4121-a0e7-5d43dd6e534d',
  '795203b5-02f9-4451-b4ad-07aa8d6af288',
  '4186081f-12e0-49ce-8227-0574e27e0959'
);

-- Step 2: Delete loyalty_programs for duplicate businesses
DELETE FROM loyalty_programs 
WHERE business_id IN (
  '49c4ce0a-7ebd-4121-a0e7-5d43dd6e534d',
  '795203b5-02f9-4451-b4ad-07aa8d6af288',
  '4186081f-12e0-49ce-8227-0574e27e0959'
);

-- Step 3: Delete the duplicate businesses
DELETE FROM businesses 
WHERE id IN (
  '49c4ce0a-7ebd-4121-a0e7-5d43dd6e534d',
  '795203b5-02f9-4451-b4ad-07aa8d6af288',
  '4186081f-12e0-49ce-8227-0574e27e0959'
);