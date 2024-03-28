const accountModel = require("../models/account-model");
const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    // console.error("registerAccount error:", error.message)
    return error.message;
  }
}

/* **********************
 *   Check for existing email  account.
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT COUNT(*) FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    console.log("result from email count", result)
    const count = parseInt(result.rows[0].count);
    // return result
    // return result.rows[0]
    // Returning true if count is more than 0, false otherwise
    return count > 0 ? true : false;

  } catch (error) {
    console.error("Error checking existing email:", error.message);
    return false; // Handle error gracefully and return false
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    // console.log("result from db (getAccountByEmail): ", result);

    return result.rows[0]
  } catch (error) {
    return new Error("No matching data found for this email");
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmailReg(account_email) {
  try {
    const sql = "SELECT COUNT(*) FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    // return result.rows[0].count !== 1
    // return result.rows[0]
    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking existing email:", error.message);
    return false; // Handle error gracefully and return false
  }
}

/* *****************************
 * Return account data using account_Id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_firstname, account_lastname, account_email, account_id FROM account WHERE account_id = $1",
      [account_id]
    );

    console.log("result from db (getAccountById): ", result);

    // return result.rows[0].account_id;
    return result.rows[0]; 
  } catch (error) {
    throw new Error("No matching account_id found error:", error);
  }
}

async function getAccountUpdateData(account_id) {
  try {
    const result = await pool.query(
      "SELECT  account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("No matching data found");
  }
}

/* *****************************
 *   Update account Post method
 * *************************** */

async function updateAccountData(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  // console.log("Update account BD was called");
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    // console.log("BD result", result);
    return result.rows[0]; // Return the updated row
  } catch (error) {
    return error.message;
  }
}

async function updateAccountPassword(account_password, account_id) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [account_password, account_id]);
    return result.rows; // Return the updated row(s)
  } catch (error) {
    return error.message;
  }
}







module.exports = {
  registerAccount,
  checkExistingEmail,
  checkExistingEmailReg,
  getAccountByEmail,
  getAccountUpdateData,
  updateAccountData,
  updateAccountPassword,
  getAccountById,
};
