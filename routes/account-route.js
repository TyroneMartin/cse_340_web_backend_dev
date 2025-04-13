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

router.get('/update/:account_id', utilities.handleErrors(accountController.accountUpdate))


// router for management route 
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
router.get('/admin', utilities.checkAccountTypeAdminOnly, utilities.handleErrors(accountController.buildAdminTool))



/* ***************************
* Proccess Registration * Unit 4 Activity  middleware
 * ************************** */
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,   // custom middleware for checking registration data
  utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/login",
  logValidate.loginRules(), // Middleware for validating login data
  logValidate.checkLoginData, // Middleware for checking login data
  utilities.handleErrors(accountController.accountLogin) // Middleware for handling errors
)

// Update user info post method
router.post('/update', 
regValidate.accountDataUpdateRules(),
logValidate.accountDataCheck,

utilities.handleErrors(accountController.accountUpdatePost) 
)

// Change password
router.post('/update-password', 
regValidate.accountPasswordRules(),
logValidate.accountPasswordCheck,
utilities.handleErrors(accountController.accountUpdatePostPasswordChange) 
)


// Export router to be used elsewhere
module.exports = router
