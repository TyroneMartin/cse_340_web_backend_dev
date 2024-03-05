const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}; // Added invCont as an empty object

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id)
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
    const data = await invModel.getInventoryByClassificationId(classification_id)
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
// invCont.postAddClassification = async function (req, res, next) {
//   try {
    
//     const title = "Add New Classification"
//     const classification_name = req.body.classification_name
//     const response   = await  invModel.AddClassificationIntoDatabase(classification_name)
//     let nav = await utilities.getNav();
//     console.log("Responsen db", response)
//     if(response) {
//     req.flash("notice", 'Sucess! New classification was added.');
//     req.flash("notice", 'You may now add a new inventor');
//     res.render("./inventory/add-new-inventory", {
//       title,
//       nav,
//       errors: null,
//     });
//   } else {
//       req.flash("notice", 'Please enter a valid character. The field cannot be left empty.');
//       res.render("./inventory/add-new-inventory", {
//         title,
//         nav,
//         errors: null,
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// }

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
    const response = await invModel.AddInventoryIntoDatabase(bodyInventoryData)
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data) {
      const error = new Error("No data found")
      error.status = 404;
      throw error
    }
    let nav = await utilities.getNav();
    console.log("Response from database:", response);
    if (response) {
      req.flash("notice", 'Success! Data was successfully updated to our website.');
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
};

invCont.postAddInventory = async function (req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
 
  let selectList = await utilities.buildClassificationGrid(classification_id)
 
  const invResult = await invModel.AddInventoryIntoDatabase(
    
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    )

  let nav = await utilities.getNav()
 
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_make} ${inv_model} to the inventory!`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      selectList,
    })
  } else {
    req.flash("notice", "Sorry, there was an issue adding a new vehicle. Please try again.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      selectList,
    })
  }
}




module.exports = invCont;
