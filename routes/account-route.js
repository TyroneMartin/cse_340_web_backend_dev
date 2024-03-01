// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const baseController = require('../controllers/baseController');
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const logValidate = require('../utilities/account-validation')


/* ***************************
* Route to build inventory by login view  * Unit 4 Activity 
 * ************************** */

// Deliver Login View 
router.get('/login', utilities.handleErrors(accountController.buildLogin))


// Deliver registration View 
router.get('/register', utilities.handleErrors(accountController.buildRegister))


// Deliver management View 
router.get("/management", accountController.buildManagement)




// router.post('/login', utilities.handleErrors(accountController.buildVerifiedView))


// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

/* ***************************
* Proccess Registration * Unit 4 Activity  middleware
 * ************************** */

// Process the registration data (middleware) for checking registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,   // custom middleware for checking registration data
    utilities.handleErrors(accountController.registerAccount)
)


// router.post(
//   "/register",
//   logValidate.loginRules(), // Middleware for validating login data
//   logValidate.checkLogData, // Middleware for checking login data
//   utilities.handleErrors(baseController.buildHome) // Middleware for handling errors
// )



// Export router to be used elsewhere
module.exports = router
