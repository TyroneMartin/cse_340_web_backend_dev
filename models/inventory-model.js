const pool = require("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query(`SELECT * FROM public.classification 
  where classification_approved = true 
  ORDER BY classification_id`)
}

async function getClassificationsList(){
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
      WHERE i.classification_id = $1 AND i.inv_approved = true`,
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
      `SELECT inv_id, inv_price, inv_description, inv_make, inv_model, inv_year, inv_color, inv_miles, inv_image, inv_thumbnail, classification_id
      FROM public.inventory 
      WHERE inv_id = $1`,  
      [inv_id]
    );
    console.log("data from getInventoryById: ",data )

    return data.rows[0] //  index with reture the first ID from inv_id, so only one row is returned
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

async function AddInventoryIntoDatabase(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) { 
  try {
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    const values = [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color];
    return await pool.query(sql, values);
  } catch (error) {
    console.error("addNewVehicleClassification error:", error.message);
    throw error;
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  const classification_id = inv_classification
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error (updateInventory): " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
    console.log("delete item from database--- deleteInventoryItem():", deleteInventoryItem)
  }
}

/* ***************************
 *  inv/pending_approval Queries
 * ************************** */

async function getUnapprovedClassification() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_approved = false
   `,
    );
    return data.rows  // returns all the rows for my foreach loop
  } catch (error) {
    console.error("getUnapprovedClassification error: ", error);
    throw error;
  }
}


async function getUnapprovedInventory() {
    try {
      const data = await pool.query(
        `SELECT inv_id, inv_year, inv_make, inv_model, inv_approved, classification_name 
        FROM public.inventory AS i 
        INNER JOIN classification AS c ON c.classification_id = i.classification_id
        WHERE i.inv_approved = false`,  
      )      
      return data.rows
    } catch (error) {
      console.error("getUnapprovedInventory error: ", error);
      throw error;
    }
  }
  

async function approveClassification(classification_id) {
  try {
    const data = await pool.query(
      `UPDATE public.classification 
      SET 
          classification_approved = true,
          account_id = $1,
          classification_approval_date = CURRENT_DATE
      FROM 
          public.account
      WHERE 
          public.classification.classification_id = $1 
          AND public.classification.classification_approved = false
          AND public.account.account_id = $1;
     `,
      [classification_id]

    //   `UPDATE public.classification 
    //   SET classification_approved = true
    //   WHERE classification_id = $1 
    //   AND classification_approved = false
    //  `
    );
    return data.rowCount
  } catch (error) {
    console.error("approveClassification error: ", error);
    throw error;
  }
}


async function approveInventory(inv_id) {
  try {
    const data = await pool.query(
      `UPDATE public.inventory 
       SET inv_approved = true
       WHERE inv_id = $1 
       AND inv_approved = false`,
      [inv_id]
    );
    return data.rowCount
  } catch (error) {
    console.error("approve Inventory BD error: ", error);
    throw error;
  }
}


module.exports = { getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById, buildLogin, 
  addNewVehicleClassification, 
  AddClassificationIntoDatabase, 
  AddInventoryIntoDatabase, updateInventory, 
  deleteInventoryItem, 
  getUnapprovedClassification, 
  approveClassification,  
  // getInventory,
  getUnapprovedInventory,
  approveInventory,
  getClassificationsList,

}