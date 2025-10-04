-- Add currency field to properties table to store the original currency of the price
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_currency text DEFAULT 'DZD';

-- Update existing properties to EUR since that's what was being entered
UPDATE properties SET price_currency = 'EUR' WHERE price_currency = 'DZD' AND price::numeric > 1000;

-- Add comment to clarify the field
COMMENT ON COLUMN properties.price_currency IS 'Currency in which the price was originally entered (DZD, EUR, or USD)';