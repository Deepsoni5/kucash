-- Drop the restrictive constraint that prevents users from having agent-like fields
-- This allows 'user' role to have phone_gpay_number, photo_url, etc.
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_agent_fields;
