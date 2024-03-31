/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
//  & --Require the Session package and DB connection
const utilities = require("./utilities")
const pool = require('./database/')
const session = require("express-session")
const env = require("dotenv").config()
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventory-route")
// const inventoryRoute2 = require("./site-name/inv/")
const accountRoute = require("./routes/account-route")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const router = express.Router()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
// const validator = require('validator')  // not able to push to render (Error: Cannot find module 'validator')

const app = express();

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

// Express Messages Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(utilities.checkJWTToken)

// Route to handle logout
app.get('/account/logout', function(req, res) { // the "req" request the redirect page
  res.clearCookie('jwt')
  req.flash('notice', 'You have been successfully logged out.')
  res.redirect('/')
})

// bypass to prevent server error if res.locals.account_id 
// is not found in the view for pending_approval
app.get("/inv/pending_approval", (req, res, next) => {
  // Check if the user is logged in by verifying if certain cookies are set
  if (!req.cookies) {
    req.flash('notice', 'Your login has expired, you may sign in to resume your session.')
    return res.redirect("/");
  }
  // if yours is login in and cookies is found, then skip this process
  next();
});


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
app.use("/inv", inventoryRoute)
//  routes - Unit 4 activity
app.use("/account", accountRoute)  // or  app.use("/account", require("./routes/account-route")) but using variable name
// app.use("/inv", inventoryRoute2) 


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
    errors: null,
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