const pool = require("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification")
}

/* ***************************
 *  Get all account data
 * ************************** */
async function buildLogin(){
  return await pool.query("SELECT * FROM public.account ORDER BY account_lastname")
}


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
      `SELECT inv_id, inv_price, inv_description, inv_make, inv_model, inv_color, inv_miles, inv_image, inv_thumbnail 
      FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0]; //  index with reture the first ID from inv_id, so only one row is returned
  } catch (error) {
    console.error("getInventoryById error: ", error);
    throw error;
  }
}


/* *****************************
*   Add new cars to the database query
* *************************** */
async function addNewVehicleClassification(inv_classification, inv_make, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) { 
  try {
    const sql = "INSERT INTO vehicle_table (classification, make, description, image, thumbnail, price, year, miles, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
    const values = [inv_classification, inv_make, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color];
    return await pool.query(sql, values);
  } catch (error) {
    console.error("addNewVehicleClassification error:", error.message);
    throw error;
  }
}

/* *****************************
* Function to add classification_name into the database
* *************************** */
async function AddClassificationIntoDatabase(classification_name) { 
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";

    const values = [classification_name];
    return await pool.query(sql, values);
  } catch (error) {
    console.error("Add new classification:", error.message);
    throw error;
  }
}


/* *****************************
* Function to add /inv/add-new-inventory into the database
* *************************** */
async function AddInventoryIntoDatabase(inventoryData) { 
  try {
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, inventoryData);
  } catch (error) {
    console.error("Add new Inventory:", error.message);
    throw error;
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, buildLogin, addNewVehicleClassification, AddClassificationIntoDatabase, AddInventoryIntoDatabase }
