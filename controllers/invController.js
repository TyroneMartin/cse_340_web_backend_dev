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
    if (!data || data.length === 0) { // Handle the case when data is empty or undefined
      const error = new Error("No data found. Please report to system admin");
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
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classifications = (await invModel.getClassifications()).rows;
    // console.log("classificationSelect function for form: ",  )
      res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classifications,
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
    let classifications = (await invModel.getClassifications()).rows

    res.render("./inventory/add-classification", {
      nav,
      title: "Add New Classifications",
      // grid,
      classifications: classifications,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

// Build page for add inventory item to be delivered or render to the browser
invCont.buildAddInventory = async function (req, res, next) {  
  try {
    let nav = await utilities.getNav()
    let classifications = (await invModel.getClassifications()).rows
    console.log("classification nav data", classifications)
    res.render("./inventory/add-new-inventory", {
      classifications,
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
    
    const title = "2Add New Classification"
    const classification_name = req.body.classification_name
    const response   = await  invModel.AddClassificationIntoDatabase(classification_name)
    let nav = await utilities.getNav();
    let classifications = (await invModel.getClassifications()).rows
    console.log("Response from db log", response)
    if(response) {
    req.flash("notice", 'Sucess! New classification was added.');
    req.flash("notice", 'You may now add a new inventor');
    res.render("./inventory/add-new-inventory", {
      classifications,
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
    const {
      inv_classification,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    } = req.body;

    console.log("Data posted to Inv: ", req.body);

    const invResult = await invModel.AddInventoryIntoDatabase(
      inv_classification,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    );

    let nav = await utilities.getNav();
    let classifications = (await invModel.getClassifications()).rows

    if (invResult) {
      req.flash(
        "notice",
        `Congratulations, you\'ve successfully added ${inv_make} ${inv_model} to the inventory!`
      );
      res.render("./inventory/add-new-inventory", {
        classifications,
        title: "Success! Vehicle Added.",
        nav,
        errors: null,
      });
    } else {
      req.flash(
        "notice",
        "Sorry, there was an issue adding a new vehicle. Please try again."
      );
      res.render("./inventory/add-new-inventory", {
        classifications,
        title: "Please try again to Insert valid data",
        nav,
        errors: null,
      });
    }
  } catch (err) {
    // Handle errors
    next(err);
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}




// edit inventory view for management/employees allow items to be edited from the rendered page
// invCont.buildEditInventory = async function (req, res, next) {  
//   try {
//     let nav = await utilities.getNav()
//     let classifications = (await invModel.getClassifications()).rows
//     console.log("classification nav data", classifications)
//     res.render("./inventory/add-new-inventory", {
//       classifications,
//       nav,
//       title: "Add New Classifications",
//       // grid,
//       errors: null,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

/* ***************************
 *  Build edit inventory view for management/employees allow items to be edited from the rendered page
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  console.log("inv_id #:", inv_id); // Log the value of inv_id
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)  // Retrieve item data first
  let classifications = (await invModel.getClassifications()).rows    // Then get classifications  
  console.log('description for inv_id:', itemData.inv_description)
  console.log("itemData:", itemData)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    itemData,
    nav,
    classifications,
    errors: null,
    inv_id: itemData.inv_id,
    classification_id: itemData.classification_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
  }) 
}



module.exports = invCont;
