const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view OLD CODE
 * ************************** */
// invCont.buildByClassificationId = async function (req, res, next) {
//   const classification_id = req.params.classificationId
//   const data = await invModel.getInventoryByClassificationId(classification_id)
//   const grid = await utilities.buildClassificationGrid(data)
//   let nav = await utilities.getNav()
//   const className = data[0].classification_name
//   res.render("./inventory/classification", {
//     title: className + " vehicles",
//     nav,
//     grid,
//   })
// }

// NEW CODE 

// invCont.buildByClassificationId = async function (req, res, next) {
//   const classification_id = req.params.classificationId
//   const data = await invModel.getInventoryByClassificationId(classification_id)
//   if (!data || data.length === 0) {
//     // Handle the case when data is empty or undefined
//     return res.status(404).send('No data found');
//   }
//   const grid = await utilities.buildClassificationGrid(data)
//   let nav = await utilities.getNav()
//   const className = data[0].classification_name
//   res.render("./inventory/classification", {
//     title: className + " vehicles",
//     nav,
//     grid,
//   })
// }

// module.exports = invCont


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || data.length === 0) {
      // Handle the case when data is empty or undefined
      const error = new Error('No data found');
      error.status = 404;
      throw error;
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err); 
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
    })
  } catch (err) {
    next(err); 
  }
}

invCont.getInventoryById = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const item = await invModel.getInventoryById(inv_id);
    if (!item) {
      const error = new Error('Inventory item not found');
      error.status = 404;
      throw error;
    }
    // const title = `${item.inv_make} ${item.inv_model}`; // Define the title
    // const title = item.inv_make;

    // Format the price with commas
    // const formattedPrice = item.inv_price.tofix(2);
   // Format the price with commas and 2 decimal places
    let nav = await utilities.getNav();
    const grid = await utilities.buildClassificationGrid(item);
    res.render("./inventory/detail", {
      nav,
      title : `${item.inv_make} ${item.inv_model}`,
      gridID: item.inv_id,
      // price: formattedPrice, // Use formatted price with commas
      price: item.inv_price,
      Description: item.inv_description,
      model: item.inv_model,
      color: item.inv_color,
      mileage: item.inv_miles,
      image: item.inv_image,
      thumbnail: item.inv_thumbnail,
     
    });
  } catch (err) {
    next(err);
  }
};

module.exports = invCont


