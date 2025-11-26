-- Allow business owners to update stamp transactions (approve/reject)
CREATE POLICY "Business owners can update transactions for their business"
ON stamp_transactions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = stamp_transactions.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow business owners to update stamp cards for their business (increment stamps)
CREATE POLICY "Business owners can update stamp cards for their business"
ON stamp_cards FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = stamp_cards.business_id
    AND businesses.owner_id = auth.uid()
  )
);