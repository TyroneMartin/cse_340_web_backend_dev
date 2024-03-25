const utilities = require(".")

const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")


const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [   // Validation rules for account registration
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // last name checkAddClassificationDatame is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.
 
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // Refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email, { req }) => {
      const accountEmail= req.body.account_email
          const emailExists = await accountModel.checkExistingEmail(account_email, accountEmail) // Yes - throw error 
          if (emailExists) {
          throw new Error("Email already exists. Please use a different email or sign in")
          }
  }),
    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ]
}

validate.loginRules = () => {
  return [
    // Validation rules for account registration
    // firstname is required and must be string
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return 
  }
  next()
}

validate.checkLoginData = async (req, res, next) => {
    const { account_email, account_password  } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_email,
        account_password,
      })
      return 
    }
    next()
  }



  //for account update data check
  validate.accountDataUpdateRules = () => {
    return [  
      body("account_firstname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name.") // on error this message is sent.
        .isAlpha()
        .withMessage('First name must contain only letters'),
  
      // last name checkAddClassificationDatame is required and must be string
      body("account_lastname")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a last name.") // on error this message is sent.
        .isAlpha()
        .withMessage('First name must contain only letters'),
        
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // Refer to validator.js docs
      .withMessage("A valid email is required.")
    ]
  }

  validate.accountDataCheck = async (req, res, next) => {
    console.log("Account data check was called")
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("There are errors in account update validation", errors)
      let nav = await utilities.getNav()
      res.render("account/update", {
        errors,
        title: "Account Management Portal",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return 
    }
    next()
  }



  validate.accountPasswordRules = () => {
    return [   // Validation rules for account registration
        body("newPassword")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("The new password entered doesn\'t meet the requirements. Please check the requirements and try again"),

        body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("your confirmed password entered doesn\'t meet the requirements. Please check the requirements and try again"),
    ]
  }


  validate.accountPasswordCheck= async (req, res, next) => {
    const { currentPassword, newPassword, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update", {
        errors,
        title: "Account Management Portal",
        nav,
        // currentPassword, 
        newPassword, 
        account_password
      })
      return 
    }
    next()
  }



module.exports = validate