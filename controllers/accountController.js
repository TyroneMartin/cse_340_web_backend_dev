const accountModel = require("../models/account-model")
const utilities = require("../utilities/")  // Corrected the path to utilities

/* *******************************     *
 * Account Controllers                 *
 * Unit 4, deliver login view activity *
 *                                     *
 * ****************************** */  

const accountController = {} // Added accountController as an empty object


/* ****************************************
*  Deliver login view
* *************************************** */

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
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      const grid = await utilities.buildRegister()  // Generate for registration form HTML
      res.render("account/register", {
        title: "Register",
        nav,
        grid,
        errors: null,
      })
    } catch (err) {
      next(err);
    }
  }

/* ****************************************
*  Deliver veried login view
* *************************************** */
  // accountController.verifiedView = async function (req, res, next) {
  //   try {
  //       let nav = await utilities.getNav()
  //       const grid = await utilities.buildVerifiedView()  // Generate for registration form HTML
  //       res.render("account/login", {
  //         title: `Welcome to the ${req.body.account_firstname} ${req.body.account_lastname}`,
  //         nav,
  //         grid,
  //        errors: null,
  //       })
  //     } catch (err) {
  //       next(err);
  //     }
  //   }



/* ****************************************
*  Process Registration data to the database
* *************************************** */
  accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
  console.log("Registration Result", regResult)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    const grid = await utilities.buildLogin()
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      grid
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    const grid = await utilities.buildRegister()
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      error: null,
      grid
    })  
  }
  
}

  
  module.exports = accountController 
  
