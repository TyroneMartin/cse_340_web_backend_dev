const accountModel = require("../models/account-model")
const pool = require('../database/')

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      // console.error("registerAccount error:", error.message);
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check if email and password exist
 * ********************* */

async function checkExistingAndPassword(account_email, account_password) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 and account_password = $2";
    const result = await pool.query(sql, [account_email, account_password]);
    if (result.rows.length > 0) {
      return true; // Account exists
    } else {
      return false; // Account does not exist
    }
  } catch (error) {
    throw error.message; // Propagate the error
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}



  module.exports = {registerAccount, checkExistingEmail, checkExistingAndPassword, getAccountByEmail}