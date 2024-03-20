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
      // console.error("registerAccount error:", error.message)
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
      const sql = "SELECT COUNT(*) FROM account WHERE account_email = $1"
      const result = await pool.query(sql, [account_email])
      return result.rows[0].count !== "0"
  } catch (error) {
      console.error("Error checking existing email:", error.message)
      return false // Handle error gracefully and return false
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


async function updateAccountData(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_email, account_firstname, account_lastname, account_type, account_password FROM account WHERE account_id = $1',
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    throw new Error("No matching data found")
  }
}




  module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, updateAccountData}