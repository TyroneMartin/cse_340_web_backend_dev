const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}; // Added invCont as an empty object

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    if (!data || data.length === 0) {
      // Handle the case when data is empty or undefined
      const error = new Error("No data found");
      error.status = 404;
      throw error;
    }
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav(); // use utilities to the get navigation data
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

invCont.intentionalError = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/detail", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

invCont.getInventoryById = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const data = await invModel.getInventoryById(inv_id);
    if (!data) {
      // Handle the case when data is empty or undefined
      const error = new Error("No data found");
      error.status = 404;
      throw error;
    }
    const grid = await utilities.buildDetailGrid(data);
    let nav = await utilities.getNav(); // use utilities to the get navigation data
    const title = data.inv_make + " " + data.inv_model;
    res.render("./inventory/classification", {
      title,
      nav,
      grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

// For management page
invCont.buildManagement = async function (req, res) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      // grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

// For adding items to the classification page
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classifications",
      nav,
      // grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};


invCont.AddClassification = async function (req, res, next) {
  try {
    // Access data from req.body
    const addClassificationData = req.body.classification_name;
    let nav = await utilities.getNav(); // use utilities to get navigation data
    const title = "Add New Classification";
    
    // Update nav bar with classification_name data and store to the database
    nav = addClassificationData.classification_name;
    res.render("./inventory/classification", {
      title,
      nav,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};















// invCont.addNewVehicleClassification = async function (req, res, next) {
//   try {

//     const grid = await utilities.(data)
//     let nav = await utilities.getNav()  // use utilities to the get navigation data
//     const title = "Add New Vehicle Classification"
//     res.render("./inventory/classification", {
//       title,
//       nav,
//       grid,
//       errors: null,
//     })
//   } catch (err) {
//     next(err);
//   }
// }

module.exports = invCont;
