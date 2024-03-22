// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const accountController = require("../controllers/accountController") 
const invAddToFormValidate = require("../utilities/inv-validation")

const utilities = require("../utilities/") 

/* ***************************
 * Get method to render pages
 * ************************** */
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))  // Route to build inventory by classification view
router.get("/intentional_error", utilities.handleErrors(invController.intentionalError))
router.get("/detail/:inv_id", utilities.handleErrors(invController.getInventoryById))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// routes for managers and employees only
router.get("/edit/:inv_id",  utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))
router.get( "/add-new-inventory",  utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))
router.get( "/add-classification",  utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))
router.get("/update/", utilities.checkAccountType, utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView)
)
// Deliver main route for management View  for /inv/ under varible inventoryRoute
router.get("/", utilities.checkJWTToken, utilities.checkAccountType, utilities.checkLogin, utilities.handleErrors(invController.buildManagement))

// ------------------------------------------------------------

/* ***************************
 * Post to handle and process the data received
 * ************************** */

router.post(
  '/add-classification',
  invAddToFormValidate.addClassificationRules(), // Middleware for checking
  utilities.checkAccountType, // check the account type
  invAddToFormValidate.checkAddClassificationData,   // Custom middleware for checking adding inventory data
  utilities.handleErrors(invController.postAddClassification) // Middleware for handling errors
);


router.post(
  '/add-new-inventory',
  invAddToFormValidate.addInventoryRules(), // Middleware for checking
  utilities.checkAccountType, // check the account type
  invAddToFormValidate.checkAddInventoryData,   // Custom middleware for checking adding inventory data
utilities.handleErrors(invController.postAddInventory)// Middleware for handling errors
)


router.post(  // Edit View for post method
"/update",  
invAddToFormValidate.addInventoryRules(), // Middleware for checking
invAddToFormValidate.checkUpdateData,   // Custom middleware for checking adding updated data
utilities.handleErrors(invController.updateInventory)
)


router.post("/delete", 
utilities.checkAccountType, // check the account type
utilities.handleErrors(invController.deleteItem)
)


module.exports = router