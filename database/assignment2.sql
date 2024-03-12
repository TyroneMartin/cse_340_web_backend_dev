
--Task One - Write SQL Statements

-- #1

INSERT INTO public.account (   -- added to account (Tony, Stark, tony@starkent.com, Iam1ronM@n)

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

-- #3 Delete the Tony Stark record from the database.

DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';


-- #4  Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" 

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- OR altherative 
-- UPDATE public.inventory
-- SET inv_description = 'Do you have 6 kids and like to go offroading? The Hummer gives you the a huge interior with an engine to get you out of any muddy or rocky situation'
-- WHERE inv_make = 'GM' AND  inv_model = 'Hummer';


-- #5 Use an inner join to select the make and model fields from the inventory table and the classification name field from the classification table for inventory items that belong to the "Sport" category.

SELECT public.inventory.inv_make, public.inventory.inv_model, public.classification.classification_name
FROM public.inventory
INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';


-- #6 
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');



-- lesson 5 account types:
UPDATE public.account 
SET account_type = 'Admin'
WHERE account_email = 'manager@340.edu';



