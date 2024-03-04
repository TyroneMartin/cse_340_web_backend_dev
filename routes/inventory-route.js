// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const accountController = require("../controllers/accountController")  
const utilities = require("../utilities/") 


/* ***************************
* Route to build inventory by classification view  * Unit 3, Activity 
 * ************************** */

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/intentional_error", invController.intentionalError)
router.get("/detail/:inv_id", invController.getInventoryById)
router.get( "/add-classification", invController.buildAddClassification)
router.get( "/add-new-inventory", invController.buildAddInventory)

// Deliver management View  for /inv under varible inventoryRoute
router.get("/", invController.buildManagement)



// router.post(
//   "/add-classification",
//   invController.AddClassification(), // Middleware for validating login data
//   utilities.handleErrors(invController.buildAddClassification) // Middleware for handling errors
// )


router.post(
  '/add-classification',
  invController.postAddClassification, // Middleware for validating classification data
  async function(req, res, next) {
    try {
      // Access data from req.body
      const classification_name = req.body.classification_name;
      
      // Add classification_name to navigation bar and database
      await utilities.getNav(); 
      await AddClassificationIntoDatabase(classification_name);

      // Redirect 
      // res.redirect('/add-classification'); 
      // res.redirect('/login'); 
      res.redirect('/login'); 
    } catch (error) {
      next(error);
    }
  }
);



// router.post(
//   "/login",
//   logValidate.loginRules(), // Middleware for validating login data
//   logValidate.checkLoginData, // Middleware for checking login data
//   utilities.handleErrors(baseController.buildHome) // Middleware for handling errors
// )




module.exports = router