const utilities = require(".")
const body  = require("express-validator")
// const utilities = require("../utilities/")  

// const invModel = require("../models/inventory-model");


const invAddToFormValidate = {}

invAddToFormValidate.addInventoryRules = async (req, res, next) => {
    return [
        // Validation rules for adding classification
        body("inv_classification")
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
invAddToFormValidate.addClassificationRules = async (req, res, next) => {
    return [
        // Validation rules for adding classification
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Please provide a valid classification name")
            .isAlpha()
            .withMessage("Only alphabetic characters are allowed"),
    ];
};  




/* ******************************
 * Check data 
 * ***************************** */
invAddToFormValidate.checkAddClassificationData = async (req, res, next) => {
    try {
        const { classification_name } = req.body;
        let errors = validationResult(req);
        let classifications = (await invModel.getClassifications()).rows;

        if (!errors.isEmpty()) {
            let nav = await utilities.getNav();
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

















module.exports = invAddToFormValidate