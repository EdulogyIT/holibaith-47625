-- Fix properties that were entered in EUR but stored as DZD
-- Update all short-stay properties with prices between 50-1000 to EUR
-- (These are clearly EUR/USD prices, not DZD)
UPDATE properties 
SET price_currency = 'EUR' 
WHERE category = 'short-stay' 
  AND price_currency = 'DZD' 
  AND price::numeric BETWEEN 50 AND 1000;

-- Fix specific properties by title that are clearly EUR
UPDATE properties 
SET price_currency = 'EUR' 
WHERE price_currency = 'DZD' 
  AND (
    title ILIKE '%duplex%' 
    OR title ILIKE '%villa%' 
    OR title ILIKE '%Beautiful%'
    OR title ILIKE '%Algerian Home%'
  )
  AND price::numeric BETWEEN 50 AND 1000;

-- Fix the Casa Grand property with incorrect price
UPDATE properties 
SET price = '430', price_currency = 'EUR'
WHERE title ILIKE '%casa grand%' 
  AND price::numeric > 1000000;