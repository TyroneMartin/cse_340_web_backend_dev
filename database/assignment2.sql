
-- added to account (Tony, Stark, tony@starkent.com, Iam1ronM@n)

INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);


-- #2 Modify the Tony Stark record to change the account_type to "Admin".

UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Delete the Tony Stark record from the database.

DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" 
UPDATE public.inventory
SET inv_description = 'Do you have 6 kids and like to go offroading? The Hummer gives you the a huge interior with an engine to get you out of any muddy or rocky situation'
WHERE inv_make = 'GM' AND  inv_model = 'Hummer';

--0r 

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.

SELECT public.inventory.inv_make, public.inventory.inv_model, public.classification.classification_name
FROM public.inventory
INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';



