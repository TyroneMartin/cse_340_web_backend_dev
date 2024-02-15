 /* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventory-route")


/* ***********************
 * View Engine and Templates 
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes 
 *************************/
app.use(require("./routes/static"));

// Index route 
app.get("/", baseController.buildHome);
// Inventory routes
// app.use("/inv", inventoryRoute)
app.use("/inv", require("./routes/inventory-route"));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


// Controller function
baseController.buildHome = function(req, res) {
  res.render("index", { title: "Home" });
};




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})