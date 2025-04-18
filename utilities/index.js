const invModel = require("../models/inventory-model");
// const utilities = require('../utilities')
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += "<hr>";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the Detail view HTML
 * ************************************ */

Util.buildDetailGrid = async function (data, title) {
  // Add title parameter
  let grid = ""; // Initialize grid variable
  let formatedPrice = new Intl.NumberFormat("en-US").format(data.inv_price);
  let Description = data.inv_description;
  let model = data.inv_model;
  let color = data.inv_color;
  let thumbnail = data.inv_thumbnail;
  let mileage = new Intl.NumberFormat("en-US").format(data.inv_miles);
  let image = data.inv_image;

  if (data) {
    grid += '<div class="large-view-container">';
    // grid += '<hr class="firstHr"></hr>';
    grid += '<div class="singleViewClassificationContent">';
    grid += `<p class="bold top-margin"><span class="first-word">Price:</span> <span class="price">$ ${formatedPrice}</span></p>`;
    grid += `<p class="bold"><span class="first-word">Description:</span> ${Description}</p>`;
    grid += `<p class="bold"><span class="first-word">Model:</span> ${model}</p>`;
    grid += `<p class="bold"><span class="first-word">Color:</span> ${color}</p>`;
    grid += `<p class="bold"><span class="first-word">Mileage:</span> ${mileage}</p>`;
    grid += "</div>";
    // grid += '<hr class="lastHr">';
    // Display thumbnail for small screens
    grid += `<img src="${thumbnail}" alt="${title}" class="thumbnail classificationDetail-Image">`;
    // Display full-size image for large screens
    grid += `<img src="${image}" alt="${title}" class="not_Thumbnail-LargerImage classificationDetail-Image">`;
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the Account view HTML
 * ************************************ */

Util.buildLogin = async function () {
  let grid = ""; // Initialize grid variable
  grid += '<form id="loginForm" action="/account/login" method="post">';
  grid += "<fieldset>";
  grid += "<legend>Login Information</legend>"; // Add legend for fieldset
  grid += '<div class="content">';
  grid += '<div class="FormContainer">';
  // For email field
  grid += '<label for="account_email"><b>Email:</b></label>';
  grid +=
    '<input type="email" placeholder="Enter email" id="account_email" name="account_email" required>';
  // For password field
  grid += '<label for="account_password"><b>Password:</b></label>';
  grid +=
    '<span><input type="password" id="account_password" name="account_password" placeholder="Enter password" autocomplete="current-password" pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$" required></span>';
  // For Check box to show password()
  grid += '<span class="showPasswordContainer">';
  grid += '<input type="checkbox" id="showPasswordCheck" name="showPassword">';
  grid += '<label for="showPasswordCheck">Show password</label>';
  grid += "</span>";
  // For submit button section
  grid +=
    '<input type="submit" class="loginButton" id="showPasswordFunction" value="Log in">';
  grid += '<p>Don\'t have an account? <a href="../account/register">Register here</a></p>';
  grid += "<br>";
  grid +=
    "<p>If you already have an account, use the strong password you had created to sign in.</p>";
  grid += "<p>The the password requirements maybe found below.</p>";
  grid += '<div class="passwordRequirements">';
  grid += "<ul>";
  grid += "<li>12 characters in length, minimum</li>";
  grid += "<li>Contain at least 1 capital letter</li>";
  grid += "<li>Contain at least 1 number</li>";
  grid += "<li>Contain at least 1 special character</li>";
  grid += "</ul>";
  grid += "</div>";

  grid += "</div>"; // Close FormContainer
  grid += "</div>"; // Close content
  grid += "</fieldset>";
  grid += "</form>";

  return grid;
};

/* **************************************
 * Build the Register view HTML
 * ************************************ */

// Util.buildRegister = async function () {
// Remove on 2/27/24 and placed in the register view due to ejs codes bugs
// data missing data can be found in the register view/github history
// -------------------

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    // console.log("Res.cookies : ", jwt)
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData; // Store account data in locals & only exists for the current request-response cycle
        req.session.accountData = accountData; // Persists across multiple requests from the same client
        // console.log("res.locals.accountData ", accountData)
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in to acess your account.");
    return res.redirect("/account/login");
  }
};

// Middleware function to check account type  accountData
Util.checkAccountType = async function (req, res, next) {
  // Check if token exists
  // console.log("checkAccountType() was called");
  if (res.locals.loggedin) {
    const account = res.locals.accountData;
    if (
      account.account_type === "Employee" ||
      account.account_type === "Admin"
    ) {
      // Allow access to administrative views
      next();
    } else {
      req.flash(
        "notice",
        "You do not have permission to access this resource."
      );
      res.redirect("/account/login");
    }
  } else {
    req.flash(
      "notice",
      "You do not have permission to access this resource. You may try logging in."
    );
    res.redirect("/account/login");
  }
};

Util.checkAccountTypeAdminOnly = async function (req, res, next) {
  // Check if token exists
  // console.log("checkAccountType() was called");
  if (res.locals.loggedin) {
    const account = res.locals.accountData;
    if (
      account.account_type === "Admin"
    ) {
      // Allow access to administrative views
      next();
    } else {
      req.flash(
        "notice",
        "You do not have permission to access this resource."
      );
      res.redirect("/account/login");
    }
  } else {
    req.flash(
      "notice",
      "You do not have permission to access this resource. You may try logging in."
    );
    res.redirect("/account/login");
  }
};

module.exports = Util;
