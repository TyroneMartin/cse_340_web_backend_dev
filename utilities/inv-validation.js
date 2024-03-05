const utilities = require(".")
const { body, invValidate } = require("express-validator")

const invValidate = {}

invValidate.addClassificationRules = async (req, res, next) => {
    return [
        // Validation rules for adding classification
        body("addClassificationData")
            .trim()
            .notEmpty()
            .withMessage("Please provide a valid classification name")
            .isString()
            .withMessage("Only alphabetic characters are allowed")
    ]
}



module.exports = invValidate