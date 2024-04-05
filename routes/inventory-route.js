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
router.get("/type/:classificationId", (invController.buildByClassificationId))  // Route to build inventory by classification view
router.get("/intentional_error", (invController.intentionalError))
router.get("/detail/:inv_id", (invController.getInventoryById))
router.get("/getInventory/:classification_id", (invController.getInventoryJSON))


// routes for managers and employees only
router.get("/edit/:inv_id",  (invController.editInventoryView))
router.get( "/add-new-inventory",  (invController.buildAddInventory))
router.get( "/add-classification",  (invController.buildAddClassification))
router.get("/update/", (invController.updateInventory))
router.get("/delete/:inv_id", (invController.deleteView)
)
// Deliver main route for management View  for /inv/ under varible inventoryRoute
router.get("/", (invController.buildManagement))

// Management pending approval

router.get("/pending_approval", (invController.buildPendingApproval))

// ------------------------------------------------------------

/* ***************************
 * Post to handle and process the data received
 * ************************** */

router.post(
  '/add-classification',
  // check the account type
  (invController.postAddClassification) // Middleware for handling errors
);


router.post(
  '/add-new-inventory',
(invController.postAddInventory)// Middleware for handling errors
)


router.post(  // Edit View for post method
"/update",  
(invController.updateInventory)
)


router.post("/delete", 
(invController.deleteItem)
)


/* ***************************
 * Post to handle approval request
 * ************************** */
// /approve/classification/

router.post("/approve/classification", 
(invController.approvaRequestForClassification)
)

router.post("/deny/classification", 
(invController.denyClassificationRequest)
)


router.post("/approve/Inventory", 
(invController.approvaRequestForInventory)
)


router.post("/deny/Inventory",
(invController.denyInventoryRequest)
)


module.exports = router