const utilities = require(".")
const {body, validationResult}  = require("express-validator")
// const utilities = require("../utilities/")  

const invModel = require("../models/inventory-model");


const invAddToFormValidate = {}

invAddToFormValidate.addInventoryRules =  () => {
    return [
        // Validation rules for adding classification
        body("inv_classification")
        .trim()
        .notEmpty()
        .withMessage("Please aselelct from the list or add a new classification"),

        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Please provide a valid classification name")
            .isAlpha()
            .withMessage("Only alphabetic characters are allowed"),

        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("A minimum of three characters is required for the model."),

        body("inv_description")
            .trim()
            .notEmpty()
            .isString()
            .withMessage("Please enter a description of the vehicle."),

        body("inv_price")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("Please enter the vehicle's price.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        body("inv_year")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("Please enter the vehicle's year.")
            .isLength({ min: 4, max: 4 })
            .withMessage("Year must be a 4-digit number."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .isNumeric()
            .withMessage("Please enter the vehicle's miles, digits only."),

        body("inv_color")
            .trim()
            .notEmpty()
            .isAlpha()
            .withMessage("Please enter the vehicle's color."),
    ];
};


// Middleware function for adding classification rules
invAddToFormValidate.addClassificationRules =  () => {
    console.log("Adding classification rules was called");
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
            res.render("", {  
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
            res.render("inventory/add-classification", {
                classifications,
                errors,
                title: "Add New Classification",
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

module.exports = invAddToFormValidate