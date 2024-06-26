// const accountModel = require("../models/account-model")
const utilities = require("../utilities/")  

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        errors: null,
      })
      return
    }
    next()
  }



/* ****************************************
*  User adding classification page
* *************************************** */
accountController.addNewVehicleClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inv/type", {
      title: "New Vehicle",
      nav,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}






  module.exports = validate