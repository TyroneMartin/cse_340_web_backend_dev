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
router.get('/login', (accountController.buildLogin))
// Deliver registration View 
router.get('/register', (accountController.buildRegister))

router.get('/update/:account_id', (accountController.accountUpdate))


// router for management route 
router.get("/", (accountController.buildManagement))



/* ***************************
* Proccess Registration * Unit 4 Activity  middleware
 * ************************** */
router.post(
  "/register",
  (accountController.registerAccount)
)

router.post(
  "/login",
  (accountController.accountLogin) // Middleware for handling errors
)


// Update user info post method
router.post('/update', 
(accountController.accountUpdatePost) 
)

// Change password
router.post('/update-password', 
(accountController.accountUpdatePostPasswordChange) 
)


// Export router to be used elsewhere
module.exports = router
