const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")  // Corrected the path to utilities
const bcrypt = require("bcryptjs") // 21.6k (gizpped: 9.8k)
const baseController = require("../controllers/baseController")
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
    next(err)
  }
}

/* ****************************************
*  Process login request
* ************************************ */
accountController.accountLogin = async function (req, res) {
  try {
    let nav = await utilities.getNav()
    const grid = await utilities.buildLogin() // Generate login form HTML
    const { account_email, account_password } = req.body
    console.log(" req.body for login was data email/Pw: ", req.body)

    // Check if the account exists
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      console.log("Email doesn't matach logs, redirects to account registration page")
      // Redirect to the registration page if the account doesn't exist
      req.flash("notice", "Your email doesn\'t exsist, or try registering or sign in with different email.")
      return res.redirect("/account/login")
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (passwordMatch) {
      console.log("password match")
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        grid,
        errors: null,
        account_email,
      })
    }
  } catch (err) {
    next(err)
  }
}


/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    // const getEmail = res.req.params.account_email // Retrieve email from request parameters
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      // getEmail,
    })
  } catch (err) {
    next(err)
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
    console.log("hash password", hashedPassword)
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
      `Congratulations, you're registered ${account_firstname} ${account_lastname}. Please log in.`

    )
    // console.log("Flash notice", req.flash("notice"))

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
    next(err)
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
    next(err)
  }
}

// get route for accountUpdate
accountController.accountUpdate = async function (req, res, next) {
  console.log("accountUpdate() was called")
  try {
    // const account_id = parseInt(req.params.account_id)
    const account_id = parseInt(req.params.account_id) // Retrieve account_id from request parameters
    const accountData = await accountModel.getAccountUpdateData(account_id)
    let nav = await utilities.getNav()
    res.render("account/update", {
      title: "Account Management Portal",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: account_id,
      // account_id: accountData.account_id,
    })
  } catch (err) {
    next(err)
  }
}


/* ****************************************
*  Process for update(Post Method) data to the database
* *************************************** */
// accountController.accountUpdatePost = async function (req, res) {
//   console.log("Account update post was called")
//   try {
//     const nav = await utilities.getNav() // Await the getNav() function
//     // const accountData= parseInt(req.body.account_id) // convert to int
//     const { account_firstname, account_lastname, account_email, account_id } = req.body
//     console.log("account update data", req.body)

//     const account = await accountModel.getAccountById(account_id)
//     // Check if submitted email is same as existing
//     if (account_email != account.account_email) {
//       console.log("There's a new email")
//       // No - Check if email exists in table
//       const emailExists = await accountModel.checkExistingEmail(account_email)
//       if (!emailExists) {
//         const AccountData = await accountModel.updateAccountData(
//           account_firstname,
//           account_lastname,
//           account_email,
//           account_id,
//         )
//         console.log("updateAccountData was called: ")

//         if (AccountData) {
//           req.flash(
//             "notice",
//             `Congratulations ${account_firstname}, your account information has been updated.`
//           )
//           res.redirect("/account/")
//         } else if (account_email === account.account_email) {
//           const AccountData = await accountModel.updateAccountData(
//             account_firstname,
//             account_lastname,
//             account_email,
//             account_id,
//           )
//           if (AccountData) {
//             req.flash(
//               "notice",
//               `Congratulations ${account_firstname}, your account information has been updated.`
//             )
//             res.redirect("/account/")

//           } else {
//             req.flash("notice", "Sorry, the update failed.")
//             res.render("account/update", {
//               title: "Account Management",
//               // accountData,
//               nav,
//               error: null,
//               account_firstname,
//               account_lastname,
//               account_email,
//               account_id,
//             })
//           }
//         }
//       } }  
//     } catch (err) {
//       console.error("error updating account info: ", err)
//     }
//   }


accountController.accountUpdatePost = async function (req, res, next) {
  try {
    const nav = await utilities.getNav() // Await the getNav() function
    // const accountData= parseInt(req.body.account_id) // convert to int
    const {account_firstname, account_lastname, account_email, account_id } = req.body
    console.log("account update data", req.body)
    const AccountData = await accountModel.updateAccountData(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )
    console.log("updateAccountData was called: ")

    if (AccountData) {
      req.flash(
        "notice",
        `Congratulations ${account_firstname}, your account information has been updated.`
      )
      res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.render("account/update", {
        title: "Account Management",
        // accountData,
        nav,
        error: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      })
    }
  } catch (err) {
    next(err)
  }
}


/* ****************************************
*  Process account password update Post method
* *************************************** */
accountController.accountUpdatePostPasswordChange = async function (req, res, next) {
    try {
      const nav = await utilities.getNav() 
      const { account_firstname, account_password, account_id } = req.body
      console.log("account password update request made", req.body)
      const hashedPassword = await bcrypt.hashSync(account_password, 10)
      const AccountData = await accountModel.updateAccountPassword(
        hashedPassword,
        account_id,
      )
      console.log("updateAccountPassword was called: ")

      if (AccountData) {
        req.flash(
          "notice",
          `Congratulations ${account_firstname}, your password was updated successfully.`
        )
        res.redirect("/account/")
      } else {
        req.flash("notice", "Sorry, the update failed.")
        res.render("account/update", {
          title: "Account Management",
          nav,
          error: null,
          account_password,
          account_id,
        })
      }
    } catch (err) {
      next(err)
    }
  }

  module.exports = accountController
