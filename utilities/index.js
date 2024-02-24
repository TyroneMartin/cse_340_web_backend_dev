const invModel = require("../models/inventory-model")
// const utilities = require('./utilities')
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}




/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Detail view HTML
* ************************************ */

Util.buildDetailGrid = async function(data, title){ // Add title parameter
  let grid = '' // Initialize grid variable
  let formatedPrice = new Intl.NumberFormat('en-US').format(data.inv_price)
  let Description = data.inv_description
  let model = data.inv_model
  let color = data.inv_color
  let thumbnail = data.inv_thumbnail
  let mileage = new Intl.NumberFormat('en-US').format(data.inv_miles)
  let image = data.inv_image

  if(data){
    grid += '<div class="large-view-container">'
    grid += '<hr class="firstHr"></hr>'
    grid += '<div class="content">'
    grid += `<p class="bold top-margin"><span class="first-word">Price:</span> <span class="price">$ ${formatedPrice}</span></p>`
    grid += `<p class="bold"><span class="first-word">Description:</span> ${Description}</p>`     
    grid += `<p class="bold"><span class="first-word">Model:</span> ${model}</p>`  
    grid += `<p class="bold"><span class="first-word">Color:</span> ${color}</p>`   
    grid += `<p class="bold"><span class="first-word">Mileage:</span> ${mileage}</p>`     
    grid += '</div>'  
    grid += '<hr class="lastHr">'
    // Display thumbnail for small screens
    grid += `<img src="${thumbnail}" alt="${title}" class="thumbnail classificationDetail-Image">`
    // Display full-size image for large screens 
    grid += `<img src="${image}" alt="${title}" class="thumbnail classificationDetail-Image">`
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the Account view HTML 
* ************************************ */

Util.buildLogin = async function () {
  let grid = ''; // Initialize grid variable
    grid += '<form action="/login" method="post">'
    grid += '<fieldset>'
    grid += '<legend>Login Information</legend>' // Add legend for fieldset
    grid += '<div class="content">'
    grid += '<div class="FormContainer">'
    grid += '<label for="email" name="account_email" ><b>Email:</b></label>'    
    grid += '<input type="text" placeholder="Enter email" name="account_email" required>'
    grid += '<label name="account_password"><b>Password:</b></label>'
    grid += '<span><input type="password" placeholder="Enter password" name="account_password required></span>'
    // grid += '<button class ="loginButton" type="submit">Login</button>'
    grid += '<label name="account_password">&nbsp;</label>'
    grid += '<span class="showPasswordContainer">'
    grid += '<input type="checkbox" id="showPassword" name="showPassword" value="showPassword">'
    grid += '<label for="showPassword">Show password</label>'
    grid += '</span>'
    grid += '<input type="submit" class ="loginButton" value="Login">'
    grid += '<p>No account? <a href="../account/register">Sign-up</a></p>'
    grid += '</div>'
    grid += '</fieldset>'
    grid += '</form>'
  return grid;
};

/* **************************************
* Build the Register view HTML 
* ************************************ */

Util.buildRegister = async function () {
  let grid = ''; // Initialize grid variable
    grid += '<form action="/register" method="post">'
    grid += '<fieldset class = "fieldsetForRegistration">'
    grid += '<legend>Registration Form</legend>' // Add legend for fieldset
    grid += '<div class="containerRegistrationForm">'
    grid += '<div class="FormContainer_Register">'
    grid += '<label for="account_firstname" name="account_firstname" ><b>Last name:</b></label>'    
    grid += '<input type="text" placeholder="Enter last name" name="account_firstname" required>'
    grid += '<label for="account_lastname" name="account_lastname" ><b>First name:</b></label>'    
    grid += '<input type="text" placeholder="Enter first name" name="account_lastname" required>'
    grid += '<label for="account_firstname" name="account_firstname" ><b>Email address:</b></label>' 
    grid += '<input type="email" placeholder="Johndoe@domain.com" name="account_email" required>'
    grid += '<label name="account_password"><b>Password:</b></label>'
    grid += '<input type="password" placeholder="Enter password" name="account_password" required>'
    grid += '<span class="showPasswordContainer">'
    grid += '<input type="checkbox" id="showPassword" name="showPassword" value="showPassword">'
    grid += '<label for="showPassword">Show password</label>'
    grid += '</span>'
    grid += '<input type="submit" class ="loginButton" value="Register">'
    grid += '<P class = "passwordRequirement">*The password should meet the follow:</P>'
    grid += '<div class="passwordRequirements">'
    // grid += '<p>Password requirements:</p>'
    grid += '<ul>'
    grid += '<li>12 characters in length, minimum</li>'
    grid += '<li>Contain at least 1 capital letter</li>'
    grid += '<li>Contain at least 1 number</li>'
    grid += '<li>Contain at least 1 special character</li>'
    grid += '</ul>'
    grid += '</div>'
    grid += '</div>'
    grid += '</div>'
    grid += '</fieldset>'
    grid += '</form>'

  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports =  Util
