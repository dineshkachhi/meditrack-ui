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

