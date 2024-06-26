document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".containerForAcctMagntFormUpdate")
  const updateBtn = document.querySelector(".changePw_update-btn")
  // Disable the button initially
  updateBtn.disabled = true;
  form.addEventListener("change", function() {
    updateBtn.disabled = false // Once changes are made, it allows the disabled to set to false
})
})