const pool = require("../database/index.js")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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


/* ***************************
 *  Post all account data to the account database 
 * ************************** */

async function createAccount(account_email, account_password, account_firstname, account_lastname, account_type) {
  try {
    const data = await pool.query(
      `INSERT INTO public.account (account_email, account_password, account_firstname, account_lastname, account_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [account_email, account_password, account_firstname, account_lastname, account_type]
    );
    return data.rows;
  } catch (error) {
    console.error("createAccount error:", error);
    throw error; // Re-throwing the error for the caller to handle if needed
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryById, buildLogin, createAccount }
