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



// validate.addClassificationValidate = async (req, res, next) => {
//       const classification_name  = req.body
//       let errors = []
//       errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         let nav = await utilities.getNav()
//         res.render("account/register", {
//           errors,
//           title: "Registration",
//           nav,
//           classification_name,
//         })
//         return 
//       }
//       next()
//     }
  


module.exports = invValidate