const utilities = require(".")
const { body } = require("express-validator")

const invAddToFormValidate = {}

invAddToFormValidate.addClassificationRules = async (req, res, next) => {
    return [
        // Validation rules for adding classification
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



invAddToFormValidate.addinventoryRules = async (req, res, next) => {
    return [
        // Validation rules for adding classification
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Please provide a valid classification name")
            .isAlpha()
            .withMessage("Only alphabetic characters are allowed"),
    ];
};
















module.exports = invAddToFormValidate