const pool = require("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get detailed information of an inventory item by its ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT inv_id, inv_price, inv_description, inv_make, inv_model, inv_color, inv_miles, inv_image 
      FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0]; // Assuming inv_id is unique, so only one row is returned
  } catch (error) {
    console.error("getInventoryById error: ", error);
    throw error;
  }
}

// module.exports = {getClassifications, getInventoryByClassificationId};
module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById };
