-- Fix currency for properties that should be in EUR
UPDATE properties 
SET price_currency = 'EUR' 
WHERE id IN ('ba16abce-98dc-43c4-a167-85de8a35b1f6', '59f2bd2a-08f4-4743-bf5e-1471b7808e81');