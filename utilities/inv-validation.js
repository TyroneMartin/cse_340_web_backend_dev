const utilities = require(".")
const {body, validationResult}  = require("express-validator")
// const utilities = require("../utilities/")  

const invModel = require("../models/inventory-model");


const invAddToFormValidate = {}

invAddToFormValidate.addInventoryRules =  () => {
    console.log("Adding inventory rules was called for server validation");

    return [
        // Validation rules for adding classification
        body("inv_classification")
            .trim()
            .notEmpty()
            .withMessage("Please select from the list or add a new classification"),
    
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Please provide a valid make for your car")
            .isAlpha()
            .withMessage("Only alphabetic characters are allowed on make"),
    
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("A minimum of three characters is required for the model."),
    
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Please provide descridption for your car")
            .isString()
            .withMessage("Please enter a description of the vehicle."),
    
        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Please enter a estimated value of your car.")
            .isNumeric()
            .withMessage("Please enter the vehicle's price as digits.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),
    
        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Please enter the year of your vehicle.")
            .isNumeric()
            .withMessage("Please enter the vehicle's year as digits.")
            .isLength({ min: 4, max: 4 })
            .withMessage("Year must be a 4-digit number."),
    
        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Please enter the your vehicle's mileage.")
            .isNumeric()
            .withMessage("Please enter the vehicle's miles as digits."),
    
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Please enter the your vehicle's color.")
            .isAlpha()
            .withMessage("Please enter the vehicle's color using alphabetic characters."),
    ]
}


// Middleware function for adding classification rules
invAddToFormValidate.addClassificationRules =  () => {
    console.log("Adding classification rules was called for server validation");
    return [
        // Validation rules for adding classification
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Please provide a valid classification name")
            .isAlpha()
            .withMessage("Only alphabetic characters are allowed"),
    ]
} 

/* ******************************
 * Check data 
 * ***************************** */
invAddToFormValidate.checkAddClassificationData = async (req, res, next) => {
    try {
        console.log('checkAddClassificationData was called');
        const { classification_name } = req.body;
        let errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav();
            let classifications = (await invModel.getClassifications()).rows;
            res.render("inventory/add-classification", {  
                classifications,
                errors,
                title: "Add New Classification",
                nav,
                classification_name,
            })
        } else {
            next(); // Proceed to the next middleware
        }
    } catch (error) {
       next(error)  // Pass any caught errors to the error handling middleware
    }
}

invAddToFormValidate.checkAddInventoryData = async (req, res, next) => {
    try {
        console.log('checkAddInventoryData was called')
        const { 
            inv_classification,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        } = req.body;
        let errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav();
            let classifications = (await invModel.getClassifications()).rows;
            res.render("inventory/add-new-inventory", {
                classifications,
                errors,
                title: "Add New Classifications",
                nav,
                inv_classification,
                inv_make,
                inv_model,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_year,
                inv_miles,
                inv_color,
            })
        } else {
            next(); // Proceed to the next middleware
        }
    } catch (error) {
       next(error)  // Pass any caught errors to the error handling middleware
    }
}

/* ******************************
 * Check data for update/management View
 * ***************************** */

invAddToFormValidate.checkUpdateData = async (req, res, next) => {
    //const inv_id = parseInt(req.params.inv_id);
    try {
        //const itemData = await invModel.getInventoryById(inv_id); // Retrieve item data first
        const classifications = (await invModel.getClassifications()).rows; // Then get classifications
        console.log('Utilities update/management View check was called');
        const { 
            inv_classification,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            inv_id
        } = req.body;
        console.log("req.body in validation: ", req.body)
        let errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            console.log("there are errors in validation")
            let nav = await utilities.getNav();

            const itemName = `${inv_make} ${inv_model}`;
            res.render("./inventory/edit-inventory", {

                title: "Edit " + itemName,
                nav,
                classifications,
                selectedCategory: inv_classification,
                // classificationSelect: classificationSelect,
                errors,
                inv_id,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                inv_classification
              });
        } else {
            console.log("all good with validation")
            next(); // Proceed to the next middleware
        }
    } catch (error) {
        next(error); // Pass any caught errors to the error handling middleware
    }
};









module.exports = invAddToFormValidate