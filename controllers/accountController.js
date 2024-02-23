/* *******************************     *
 * Account Controllers                 *
 * Unit 4, deliver login view activity *
 *                                     *
 * ****************************** */  
const utilities = require("../utilities/")  // Corrected the path to utilities

const accountController = {}; // Added accountController as an empty object

// async function buildLogin(req, res, next){
//     let nav = await utilities.getNav()
//     res.render("account/login", {
//         title: "Login",
//         nav,
//     })
// }

// invCont.buildLogin = async function (req, res, next) {
//     try {
//       const account_id = req.params.account_id
//       if (!account_id) { 
//         const error = new Error('Account ID not provided')
//         error.status = 404
//         throw error
//       }
//       let nav = await utilities.getNav()
//       const grid = await utilities.buildDetailGrid(account_id); 
//       res.render("./account/login", {
//         nav,
//         title: "Login",
//         grid,
//       })
//     } catch (err) {
//       next(err)
//     }
//   }

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
  
