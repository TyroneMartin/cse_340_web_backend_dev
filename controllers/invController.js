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


// Build page for add classification item to be delivered or render to the browser
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      nav,
      title: "Add New Classifications",
      // grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

// Build page for add inventory item to be delivered or render to the browser
invCont.buildAddInventory = async function (req, res, next) {  
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-new-inventory", {
      nav,
      title: "Add New Classifications",
      // grid,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};


/* ****************************************
* Access data from req.body, which pulls the data from the form... used for post method
* *************************************** */
invCont.postAddClassification = async function (req, res, next) {
  try {
    
    const title = "Add New Classification"
    const classification_name = req.body.classification_name
    const response   = await  invModel.AddClassificationIntoDatabase(classification_name)
    let nav = await utilities.getNav();
    console.log("Responsen db", response)
    if(response) {
    req.flash("notice", 'Sucess! New classification was added.');
    req.flash("notice", 'You may now add a new inventor');
    res.render("./inventory/add-new-inventory", {
      title,
      nav,
      errors: null,
    });
  } else {
      req.flash("notice", 'Please enter a valid character. The field cannot be left empty.');
      res.render("./inventory/add-classification", {
        title,
        nav,
        errors: null,
      });
    }
  } catch (err) {
    next(err);
  }
}

/* ****************************************
* Access data from req.body, which pulls the data from the form... used for post method
* *************************************** */

invCont.postAddInventory = async function (req, res, next) {
  try {
    const title = "Add New Inventory"
    const bodyInventoryData = [
      req.body.inv_make,
      req.body.inv_model,
      req.body.inv_description,
      req.body.inv_image,
      req.body.inv_thumbnail,
      req.body.inv_price,
      req.body.inv_year,
      req.body.inv_miles,
      req.body.inv_color
    ]
    const response   = await  invModel.AddInventoryIntoDatabase(bodyInventoryData)
    let nav = await utilities.getNav()
    console.log("Responsen db", response)
    if(response) {
    req.flash("notice", 'Sucess! data was successfully updatedn to our website.');
    res.render("./inventory/add-new-inventory", {
      title,
      nav,
      errors: null,
    });
  } else {
      req.flash("notice", 'Please enter a valid character. The field cannot be left empty.');
      res.render("./inventory/add-new-inventory", {
        title,
        nav,
        errors: null,
      });
    }
  } catch (err) {
    next(err);
  }
}






module.exports = invCont;
