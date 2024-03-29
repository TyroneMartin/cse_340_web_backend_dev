// const fetch = require('node-fetch')
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {} // Added invCont as an empty object

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || data.length === 0) { // Handle the case when data is empty or undefined
      const error = new Error("No data found. You may report broken link to the system admin!")
      error.status = 404
      throw error
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav() // use utilities to the get navigation data
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

invCont.intentionalError = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/detail", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

invCont.getInventoryById = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryById(inv_id)
    if (!data) {
      // Handle the case when data is empty or undefined
      const error = new Error("No data found")
      error.status = 404
      throw error
    }
    const grid = await utilities.buildDetailGrid(data)
    let nav = await utilities.getNav() // use utilities to the get navigation data
    const title = data.inv_make + " " + data.inv_model
    res.render("./inventory/classification", {
      title,
      nav,
      grid,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

// For management page
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classifications = (await invModel.getClassifications()).rows
    // console.log("classificationSelect function for form: ",  )
      res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classifications,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}


// Build page for add classification item to be delivered or render to the browser
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classifications = (await invModel.getClassifications()).rows

    res.render("./inventory/add-classification", {
      nav,
      title: "Add New Classifications",
      // grid,
      classifications: classifications,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

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
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
* Access data from req.body, which pulls the data from the form... used for post method
* *************************************** */
invCont.postAddClassification = async function (req, res, next) {
  try {
    
    const title = "Add New Classification"
    const classification_name = req.body.classification_name
    const response   = await  invModel.AddClassificationIntoDatabase(classification_name)
    let nav = await utilities.getNav()
    let classifications = (await invModel.getClassifications()).rows
    console.log("Response from db log", response)
    if(response) {
    req.flash("notice", 'Sucess! New classification was added.')
    req.flash("notice", 'You may now add a new inventor')
    res.render("./inventory/add-new-inventory", {
      classifications,
      title,
      nav,
      errors: null,
    })
  } else {
      req.flash("notice", 'Please enter a valid character. The field cannot be left empty.')
      res.render("./inventory/add-classification", {
        title,
        nav,
        errors: null,
      })
    }
  } catch (err) {
    next(err)
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
    } = req.body

    console.log("Data posted to Inv: ", req.body)

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
    )

    let nav = await utilities.getNav()
    let classifications = (await invModel.getClassifications()).rows //neded here
    if (invResult) {
      req.flash(
        "notice",
        `Congratulations, you\'ve successfully added ${inv_make} ${inv_model} to the inventory!`
      )
      res.render("./inventory/add-new-inventory", {
        classifications,  //neded here
        title: "Success! Vehicle Added.",
        nav,
        errors: null,
      })
    } else {
      req.flash(
        "notice",
        "Sorry, there was an issue adding a new vehicle. Please try again."
      )
      res.render("./inventory/add-new-inventory", {
        classifications,  //neded here
        title: "Please try again to Insert valid data",
        nav,
        errors: null,
      })
    }
  } catch (err) {
    // Handle errors
    next(err)
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    // console.log("jason data", invData)
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view for management/employees allow items to be edited from the rendered page
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  try {
    const itemData = await invModel.getInventoryById(inv_id) // Retrieve item data 
    const classifications = (await invModel.getClassifications()).rows // Then get classifications to build help build form 
    console.log("get classification log: ", classifications)

    console.log('classification Id pk:= classification_id:', itemData.classification_id)
    console.log("itemData:", itemData)
    
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      itemData,
      nav,
      classifications,
      errors: null,
      inv_id: itemData.inv_id,
      selectedCategory: itemData.classification_id,
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
  } catch (error) {
    console.error("editInventoryView error: ", error)
    // Handle error appropriately
    next(error)
  }
}

invCont.updateInventory = async function (req, res, next) {
  try {
    //const itemData = await invModel.getInventoryById(inv_id)
    let nav = await utilities.getNav()
    // let classifications = (await invModel.getClassifications()).rows
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_classification,
    } = req.body
    console.log("req.body: ", req.body)
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_classification
    )
    console.log("updated-Inventory to database:", updateResult)

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      // const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      // res.status(501).render("inventory/edit-inventory", {
      res.status(501).render("./inventory/edit-inventory", {

        title: "Edit " + itemName,
        nav,
        // classifications,
        errors,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
      })
    }
  } catch (err) {
    next(err)
  }
}

invCont.deleteView = async function (req, res, next) {
  try {
    const { inv_id } = req.params // Extracting inv_id all the parameters
    // const { inv_id, inv_make, inv_model,inv_year, inv_price } = req.params 
    const itemData = await invModel.getInventoryById(inv_id) // Retrieve item data 
    const nav = await utilities.getNav() 
    res.render("./inventory/delete-confirm", {
      itemData,
      title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
      nav,
      inv_id: itemData.inv_id, // Passing inv_id to the template
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}


invCont.deleteItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)
    let nav = await utilities.getNav()
    const { inv_make, inv_model, inv_year, inv_price } = req.body
    console.log("req.body for deleted items: ", req.body)
    const updateResult = await invModel.deleteInventoryItem(inv_id)
    console.log("delete item inv_id:", inv_id)
    if (updateResult) {
      const itemName = inv_make + " " + inv_model
      req.flash("notice", `The ${itemName} was successfully deleted from the database.`)
      res.redirect("/inv/")
    } else {
      req.flash("notice", `Sorry, the deletion failed.`)
      res.render("./inventory/delete-confirm", {
        title: `Delete ${inv_make} ${inv_model}`,
        nav,
        errors: null,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_price,
        inv_id
      })
    }
  } catch (err) {
    next(err)
  }
}

/* ***************************
 *  Get route for pending approval page
 * ************************** */

invCont.buildPendingApproval = async function (req, res, next) {  
  try {
    let nav = await utilities.getNav();
    let classifications = (await invModel.getClassifications()).rows;
    const itemData = await invModel.getInventory();
    // console.log("itemData for build Pending Approval", itemData);
    let unapprovedClassificationItems = (await invModel.getUnapprovedClassification()).rows; 
    // console.log("unapprovedClassificationItems listing: ", unapprovedClassificationItems)
    res.render("./inventory/pending_approval", {
      nav,
      errors: null,
      title: "Pending Approval Request",
      classifications,
      itemData, 
      unapprovedClassificationItems,
      classification_name: unapprovedClassificationItems.classification_name,
      classification_id: unapprovedClassificationItems.classification_id,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year
    });
  } catch (err) {
    next(err);
  }
};



// post request to approve classification
invCont.approvaRequestForClassification = async function (req, res) {
  try {
    const classification_id =  parseInt(req.body.classification_id)
    // const { classification_name  } = req.body; 
    let nav = await utilities.getNav()
    let unapprovedClassificationItems = (await invModel.getUnapprovedClassification()).rows; 
    // console.log("unapproved  classifi List", unapprovedClassificationItems)
    // console.log("classification_name was called", classification_name)
    const approveResultSet = await invModel.approveClassification(classification_id)
    // console.log("approveResultfor classification to be approved: ", approveResultSet)
    if (approveResultSet) {
      const updatedItem = unapprovedClassificationItems[0] 
      const approvedClassification = updatedItem.classification_name
      req.flash("notice", `The classification request for ${approvedClassification} has been approved.`)
      res.redirect("/account/")    
    } else {
      req.flash("notice", "Sorry, the the approval had failed. Yon may try again")
      res.render("./inventory/pending_approval", {
        title: "Pending Approval Request",
        errors,
        nav,
        unapprovedClassificationItems,
        classification_id,
        approveResultSet,
        classification_name: unapprovedClassificationItems.classification_name,
        classification_id: unapprovedClassificationItems.classification_id
      })
    }
  } catch (err) {
    // next(err)
  }
}


// post request to approve classification
invCont.approvaRequestForInventory = async function (req, res) {
  try {
    const inv = parseInt(req.body.inv_id)
    console.log("approvaRequestForInventory ID", req.body)
    let nav = await utilities.getNav()
    let unapprovedInventoryItems = (await invModel.getUnapprovedInventory()).rows
    console.log("unapprovedInventoryItems: ", unapprovedInventoryItems )
    const approveResultSet = await invModel.approveInventory(inv)
    let classifications = (await invModel.getClassifications()).rows
    if (approveResultSet) {
      const updatedItem = unapprovedInventoryItems[0];
      const approvedClassification = updatedItem.inv_make + " " + updatedItem.inv_model;
      req.flash("notice", `The Inventory request for ${approvedClassification} has been approved.`);
      res.redirect("/account/")    
    } else {
      req.flash("notice", "Sorry, the the approval had failed. Yon may try again")
      res.render("./inventory/pending_approval", {
        title: "Pending Approval Request",
        errors,
        nav,
        unapprovedInventoryItems,
        approveResultSet,
        inv_id: itemData.inv_id,
        inv_year: itemData.inv_year,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        classifications,
      })
    }
  } catch (err) {
    // next(err)
  }
}


module.exports = invCont