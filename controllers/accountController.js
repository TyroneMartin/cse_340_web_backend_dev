const accountModel = require("../models/account-model");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/"); // Corrected the path to utilities
const bcrypt = require("bcryptjs"); // 21.6k (gizpped: 9.8k)
const baseController = require("../controllers/baseController");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {}; // Added accountController as an empty object

/* *******************************     *
 * Account Controllers                 *
 * Unit 4, deliver login view activity *
 *                                     *
 * ****************************** */

// *  Deliver login view

accountController.buildLogin = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const grid = await utilities.buildLogin(); // Generate login form HTML
    res.render("./account/login", {
      nav,
      title: "Login",
      grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    const grid = await utilities.buildLogin(); // Generate login form HTML
    const { account_email, account_password } = req.body;
    console.log(" req.body for login was data email/Pw: ", req.body);

    // Check if the account exists
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
      console.log(
        "Email doesn't matach logs, redirects to account registration page"
      );
      // Redirect to the registration page if the account doesn't exist
      req.flash(
        "notice",
        "Your email doesn't exsist, or try registering or sign in with different email."
      );
      return res.redirect("/account/login");
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    );
    if (passwordMatch) {
      console.log("password match");
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        grid,
        errors: null,
        account_email,
      });
    }
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Deliver registration view
 * *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    // const getEmail = res.req.params.account_email // Retrieve email from request parameters
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      // getEmail,
    });
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Process Registration data to the database
 * *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
    console.log("hash password", hashedPassword);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
  const emailExists = await accountModel.checkExistingEmail(account_email);
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    emailExists, //  check if email exist
    hashedPassword
  );
  console.log("Registration Result", regResult);
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname} ${account_lastname}. Please log in.`
    );
    const grid = await utilities.buildLogin();
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      grid,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      error: null,
    });
  }
};

// Show Admin password reset Tool Page
accountController.buildAdminTool = async function (req, res) {
  try {
    const accounts = await accountModel.getAllAccounts();
    const nav = await utilities.getNav();
    res.render("account/admin", {
      title: "Admin Account Management",
      accounts,
      // accountData: req.session.accountData,
      nav,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Could not load admin dashboard.",
      nav: await utilities.getNav(),
      status: 500,
      errors: null,
    });
  }
};

/* ****************************************
 *  User adding classification page
 * *************************************** */
accountController.addNewVehicleClassification = async function (
  req,
  res,
  next
) {
  try {
    let nav = await utilities.getNav();
    res.render("inv/type", {
      title: "New Vehicle",
      nav,
      // grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

accountController.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

// get route for accountUpdate
    accountController.accountUpdate = async function (req, res, next) {
      console.log("accountUpdate() was called");
    
      try {
        const loggedInUser = res.locals.accountData || req.session.accountData
        const account_id = parseInt(req.params.account_id)  // Retrieve account_id from request parameters
    
        // Only allow  access if user is an admin OR user is accessing their own account
        if (
          loggedInUser.account_type !== "Admin" &&
          parseInt(loggedInUser.account_id) !== account_id
        ) {
          req.flash("notice", "Unauthorized access to account update.")
          return res.redirect("/account")
        }
    
        const accountData = await accountModel.getAccountUpdateData(account_id)
        const nav = await utilities.getNav()
    
        return res.render("account/update", {
          title: "Account Management Portal",
          nav,
          errors: null,
          account_firstname: accountData.account_firstname,
          account_lastname: accountData.account_lastname,
          account_email: accountData.account_email,
          account_id: account_id,
          account_type: accountData.account_type,
          accountData: loggedInUser, // for admin view dropdown
        })
      } catch (err) {
        next(err)
      }
    }
    

/* ****************************************
 *  Process for update(Post Method) data to the database
 * *************************************** */
accountController.accountUpdatePost = async function (req, res) {
  const nav = await utilities.getNav();
  const loggedInUser = req.session?.accountData || res.locals.accountData
  // Debug info
  // console.log("Session data:", req.session)
  // console.log("Locals data:", res.locals.accountData)
  // console.log("LoggedInUser:", loggedInUser)
  
  if (!loggedInUser) {
    req.flash("notice", "You must be logged in to update an account.");
    return res.redirect("/account/login");
  }

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    account_type,
  } = req.body;

  try {
    let updateResult;

    if (loggedInUser.account_type === "Admin") {
      updateResult = await accountModel.updateAccountWithRole(
        account_firstname,
        account_lastname,
        account_email,
        account_type,
        account_id
      );
    } else {
      if (parseInt(account_id) !== loggedInUser.account_id) {
        req.flash("notice", "Unauthorized update attempt.");
        return res.redirect("/account");
      }

      updateResult = await accountModel.updateAccountData(
        account_firstname,
        account_lastname,
        account_email,
        account_id
      );
    }

    if (updateResult) {
      // Only refresh JWT if the logged-in user updated themselves
      if (parseInt(account_id) === loggedInUser.account_id) {
        const updatedAccountData = await accountModel.getAccountById(
          account_id
        );
        delete updatedAccountData.account_password;

        const accessToken = jwt.sign(
          updatedAccountData,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: 3600 * 1000 }
        );

        res.clearCookie("jwt");
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000,
        });
      }

      req.flash(
        "notice",
        `Congratulations ${account_firstname}, the account information has been updated.`
      );
      return res.redirect("/account");
    } else {
      req.flash("notice", "Sorry, the update failed.");
      return res.status(501).render("account/editAccount", {
        title: "Edit your account:",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error("Account update error:", error);
    req.flash("notice", "Something went wrong.");
    return res.redirect("/account");
  }
};

/* ****************************************
 *  Process account password update Post method
 * *************************************** */
accountController.accountUpdatePostPasswordChange = async function (
  req,
  res,
  next
) {
  try {
    const nav = await utilities.getNav();
    const { account_firstname, account_password, account_id } = req.body;
    console.log("account password update request made", req.body);
    const hashedPassword = await bcrypt.hashSync(account_password, 10);
    const AccountData = await accountModel.updateAccountPassword(
      hashedPassword,
      account_id
    );
    console.log("updateAccountPassword was called: ");

    if (AccountData) {
      req.flash(
        "notice",
        `Congratulations ${account_firstname}, your password was updated successfully.`
      );
      res.redirect("/account/");
    } else {
      req.flash("notice", "Sorry, the update failed.");
      res.render("account/update", {
        title: "Account Management",
        nav,
        error: null,
        account_password,
        account_id,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = accountController;
