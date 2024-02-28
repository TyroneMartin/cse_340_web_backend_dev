const accountModel = require("../models/account-model")
const utilities = require("../utilities/")  // Corrected the path to utilities
const bcrypt = require("bcryptjs") // 21.6k (gizpped: 9.8k)


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


// start
// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
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
  console.log("Registration Result", regResult)
  if (regResult) {
    req.flash(
      "notice",
      // `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      `Congratulations, you're registered ${account_firstname}. Please log in.`

    )
    // console.log("Flash notice", req.flash("notice"));

    const grid = await utilities.buildLogin()
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      grid,
      
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

  
  module.exports = accountController 
  
