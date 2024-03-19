const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")  // Corrected the path to utilities
const bcrypt = require("bcryptjs") // 21.6k (gizpped: 9.8k)
const baseController = require("../controllers/baseController")  // added for testing
const jwt = require("jsonwebtoken")
require("dotenv").config()


const accountController = {} // Added accountController as an empty object

/* *******************************     *
 * Account Controllers                 *
 * Unit 4, deliver login view activity *
 *                                     *
 * ****************************** */  

// *  Deliver login view

accountController.buildLogin = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      const grid = await utilities.buildLogin() // Generate login form HTML
      res.render("./account/login", {
        nav,
        title: "Login",
        grid,
        errors: null,
      })
    } catch (err) {
      next(err);
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
  accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  // let classifications = (await invModel.getClassifications()).rows
  const { account_email, account_password } = req.body
  console.log(" req.body for login was data email/Pw: ", req.body)
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log("Account data login  Process to compare the data: ", accountData)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", { 
    title: "Login",
    nav,
    // classifications,
    errors: null,
    account_email,

   })
  return
  }
  
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      // const grid = await utilities.buildRegister()  // Generate for registration form HTML
      // const grid = await utilities.buildRegister() // was removed on 2/27/24 because the data form was built directly in the register view due to ejs codes bugs

      res.render("account/register", {
        title: "Register",
        nav,
        // grid,
        errors: null,
      })
    } catch (err) {
      next(err);
    }
  }

/* ****************************************
*  Process Registration data to the database
* *************************************** */
  accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

// Hash the password before storing
let hashedPassword
try {

  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  // const grid = await utilities.buildRegister() // was removed on 2/27/24 because the data form was built directly in the register view due to ejs codes bugs
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    // grid,
  })
}
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  )
  console.log("Registration Result", regResult)
  if (regResult) {
    req.flash(
      "notice",
      // `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      `Congratulations, you're registered ${account_firstname} ${ account_lastname}. Please log in.`

    )
    // console.log("Flash notice", req.flash("notice"));

    const grid = await utilities.buildLogin()
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      grid,
      errors: null,
      
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
  // const grid = await utilities.buildRegister() // was removed on 2/27/24 because the data form was built directly in the register view due to ejs codes bugs
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      error: null,
      // grid
    })  
  }
  
}


/* ****************************************
*  User adding classification page
* *************************************** */
accountController.addNewVehicleClassification = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      // const grid = await utilities.buildRegister()  // Generate for registration form HTML
      // const grid = await utilities.buildRegister() // was removed on 2/27/24 because the data form was built directly in the register view due to ejs codes bugs

      res.render("inv/type", {
        title: "New Vehicle",
        nav,
        // grid,
        errors: null,
      })
    } catch (err) {
      next(err);
    }
  }


  accountController.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()  
        res.render("account/management", {
          title: "Account Management",
          nav,
          errors: null,
        })
      } catch (err) {
        next(err);
      }
    }


  
  module.exports = accountController 
  