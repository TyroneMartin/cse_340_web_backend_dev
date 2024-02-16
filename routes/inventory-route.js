// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

/* ***************************
* Route to build inventory by classification view  * Unit 3, Activity 
 * ************************** */

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;