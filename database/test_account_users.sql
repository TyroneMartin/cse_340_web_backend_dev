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
    ('Jordan', 'King', 'client@example.com', 'Client@2024!', 'Client'),
    ('Jamie', 'Reid', 'employee@example.com', 'Employee#2024$', 'Employee'),
    ('Tyrone', 'Martin', 'admin@example.com', 'Admin*Secure1!', 'Admin');
