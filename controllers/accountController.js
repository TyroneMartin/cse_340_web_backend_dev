/* *******************************     *
 * Account Controllers                 *
 * Unit 4, deliver login view activity *
 *                                     *
 * ****************************** */  
const utilities = require("../utilities/")  // Corrected the path to utilities

const accountController = {}; // Added accountController as an empty object

accountController.buildLogin = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const grid = await utilities.buildLogin() // Generate login form HTML
        res.render("./account/login", {
          nav,
          title: "Login",
          grid,
        })
      } catch (err) {
        next(err);
      }
    }
  
  module.exports = accountController
  
