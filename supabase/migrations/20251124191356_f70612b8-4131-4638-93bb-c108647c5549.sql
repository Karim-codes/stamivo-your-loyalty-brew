-- Allow customers to create their own stamp transactions
CREATE POLICY "Customers can create their own stamp transactions"
ON public.stamp_transactions
FOR INSERT
WITH CHECK (auth.uid() = customer_id);