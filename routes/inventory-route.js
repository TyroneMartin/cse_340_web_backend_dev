// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const accountController = require("../controllers/accountController") 
const utilities = require("../utilities/") 


/* ***************************
 * Get method to render pages
 * ************************** */
router.get("/type/:classificationId", invController.buildByClassificationId)  // Route to build inventory by classification view
router.get("/intentional_error", invController.intentionalError)
router.get("/detail/:inv_id", invController.getInventoryById)
router.get( "/add-classification", invController.buildAddClassification)
router.get( "/add-new-inventory", invController.buildAddInventory)

// Deliver management View  for /inv under varible inventoryRoute
router.get("/", invController.buildManagement)

// ------------------------------------------------------------


/* ***************************
 * Post to handle and process the data received
 * ************************** */

router.post(
  '/add-classification',
  // invController.postAddClassification, // Middleware for checking
  utilities.handleErrors(invController.postAddClassification) // Middleware for handling errors
)

router.post(
  '/add-new-inventory',
  // invController.postAddClassification, // Middleware for checking
  utilities.handleErrors(invController.postAddInventory) // Middleware for handling errors

)

module.exports = router