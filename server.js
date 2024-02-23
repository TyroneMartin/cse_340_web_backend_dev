/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
//  & --Require the Session package and DB connection
const pool = require('./database/')
const utilities = require("./utilities")
const session = require("express-session")
const env = require("dotenv").config()
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventory-route")
const accountRoute = require("./routes/account-route")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
// Require utilities module
// Express Package and Router Functionality
const app = express();
const router = express.Router()

/* ***********************
 * Middleware
 * ************************/
// -- connect-pg-simple  and express-session
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
// ---

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

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
// Index route -- Unit 3 activity
app.get("/", utilities.handleErrors(baseController.buildHome))  // add update
// Inventory routes - Unit 3 activity
app.use("/inv", require("./routes/inventory-route"))
//  routes - Unit 4 activity
app.use("/account", require("./routes/account-route"))



// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status === 404) {
    message = err.message} else {
    message = "Oh no! There was a crash. Maybe try a different route?"
    // message = "Sorry, we appear to have lost that page."
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    status : err.status || 500,
  })
})

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