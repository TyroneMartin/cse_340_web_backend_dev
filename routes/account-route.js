// Needed Resources 
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")


/* ***************************
* Route to build inventory by login view  * Unit 4 Activity 
 * ************************** */

// Deliver Login View 
router.get('/login', utilities.handleErrors(accountController.buildLogin))


// Deliver registration View 
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Enable the Registration Route
router.post('/register', utilities.handleErrors(accountController.registerAccount))


// router.post('/login', utilities.handleErrors(accountController.buildVerifiedView))


// Export router to be used elsewhere
module.exports = router
