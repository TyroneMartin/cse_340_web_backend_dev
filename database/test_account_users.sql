CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  DELETE FROM public.account
  WHERE account_email IN (
    'client@example.com',
    'employee@example.com',
    'admin@example.com'
  );
END$$;

INSERT INTO public.account (
    account_firstname, account_lastname, account_email, account_password, account_type
) VALUES 
    ('Jordan', 'King', 'client@example.com', crypt('Client@2024!', gen_salt('bf'::text, 10)), 'Client'),
    ('Jamie', 'Reid', 'employee@example.com', crypt('Employee#2024$', gen_salt('bf'::text, 10)), 'Employee'),
    ('Tyrone', 'Martin', 'admin@example.com', crypt('Admin*Secure1!', gen_salt('bf'::text, 10)), 'Admin');


# This was intentionally uploaded to create test users since this project is not a real business