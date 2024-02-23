const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // these flash messages are for testing purposes
  // req.flash("notice", "This is a flash message.")
  // req.flash("error", "The values were entered incorrectly.")
  res.render("index", {title: "Home", nav})
}

module.exports = baseController
