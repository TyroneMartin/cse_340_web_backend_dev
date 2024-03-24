function checkPassword() {
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    // var currentPassword = $("#currentPassword").val();

    // Display all three passwords
    // console.log("New Password:", newPassword);
    // console.log("Confirm Password:", confirmPassword);
    // console.log("Current Password:", currentPassword);

    // Check if new password matches confirm password
    if (newPassword === confirmPassword) {
        $("#alertmsg").html("Password Matched!");
    } else {
        $("#alertmsg").html("Password Did not match!");
    }
}
