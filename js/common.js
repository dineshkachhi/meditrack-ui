const HOSTNAME = "https://dual-zsazsa-meditrack-7e0ead8a.koyeb.app";
//const HOSTNAME = "";



// common.js
(function() {
    const baseURL = window.location.origin; // Dynamically get the base URL (HTTP or HTTPS)
    const baseURLSecure = baseURL.startsWith("https://") ? baseURL.replace("https://", "http://") : baseURL;
  var links = document.querySelectorAll("a.dynamic-link");
        // Loop through each link and set the href attribute
              links.forEach(function(link) {
                  var path = link.getAttribute("data-href");  // Get the relative path from data-href
                  link.href = baseURLSecure + path;  // Set the full URL with the base URL + relative path
              });
})();


// Check if the user is logged in
function checkLoginStatus() {
     const tokenObj = JSON.parse(localStorage.getItem('jwtToken'));
     // Access the token from the object
      if (!tokenObj ) {
        alert("You are not logged in!");
        window.location.href = 'https://dineshkachhi.github.io/meditrack-ui/login.html';  // Redirect to login page
    } else {
           const token = tokenObj.token;
        console.log("User is logged in with token: " + token);

        // Optionally: You can add logic to verify the token locally
        // For example, checking if the token is expired (JWTs contain expiry time)
        const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token payload
        const expiryTime = payload.exp * 1000;  // Expiry time in milliseconds

        if (expiryTime < Date.now()) {
            alert("Your session has expired. Please log in again.");
            localStorage.removeItem('jwtToken');  // Clear expired token
            window.location.href = 'https://dineshkachhi.github.io/meditrack-ui/login.html';  // Redirect to login page
        }
    }
}

