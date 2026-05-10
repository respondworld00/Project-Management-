-- Update the role of the user with the specified email to 'admin'
UPDATE users 
SET role = 'admin', updated_at = CURRENT_TIMESTAMP
WHERE email = 'aadityarana463@gmail.com';

-- Verify the update
SELECT id, email, name, role, created_at, updated_at 
FROM users 
WHERE email = 'aadityarana463@gmail.com';
