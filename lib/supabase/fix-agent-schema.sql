-- Fix column length constraints for agent feature
-- The error "value too long for type character varying(6)" indicates some columns are too short.
-- We'll increase the length of potential culprit columns.

-- 1. Increase agent_id length (we generate 'AGT' + 6 digits = 9 chars)
ALTER TABLE users ALTER COLUMN agent_id TYPE TEXT;

-- 2. Increase role length (just in case it's constrained, 'agent' is 5 chars but 'customer' is 8)
ALTER TABLE users ALTER COLUMN role TYPE TEXT;

-- 3. Increase phone_gpay_number length (10 digits)
ALTER TABLE users ALTER COLUMN phone_gpay_number TYPE TEXT;

-- 4. Increase photo_url length (URLs can be long)
ALTER TABLE users ALTER COLUMN photo_url TYPE TEXT;

-- 5. Increase postal_address length
ALTER TABLE users ALTER COLUMN postal_address TYPE TEXT;
