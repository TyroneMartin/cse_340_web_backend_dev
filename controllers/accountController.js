/* *******************************     *
 * Account Controllers                 *
 * Unit 4, deliver login view activity *
 *                                     *
 * ****************************** */  
const utilities = require("../utilities/")  // Corrected the path to utilities

const accountController = {} // Added accountController as an empty object

accountController.buildLogin = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      const grid = await utilities.buildLogin() // Generate login form HTML
      res.render("./account/login", {
        nav,
        title: "Login",
        grid,
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
      })
    } catch (err) {
      next(err);
    }
  }

/* ****************************************
*  Process Registration
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
  // console.log(regResult)
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      error: null,
    })
  }
}

  
  module.exports = accountController 
  
