// Get the modal
var modal = document.getElementById("previewModal")

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0]

// When the user clicks on the link, open the modal
var previewLinks = document.getElementsByClassName("preview-link")
Array.from(previewLinks).forEach(function(link) {
  link.addEventListener("click", function(event) {
    event.preventDefault() // Prevent default link behavior
    var previewUrl = this.getAttribute("data-preview-url")
    document.getElementById("previewFrame").src = previewUrl
    modal.style.display = "block"
  })
})

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none"
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none"
  }
}
