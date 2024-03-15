document.addEventListener("DOMContentLoaded", function() {  // ensure the documents is loaded 
  const form = document.querySelector("#editInventoryForm");
  const updateBtn = document.querySelector(".edit_inventoryForm_Button");

  // Disable the button initially
  updateBtn.disabled = true

  // Add event listener to form elements
  form.addEventListener("change", function() {
      updateBtn.disabled = false // Once changes are made, it allows the disabled to set to false
  });
});