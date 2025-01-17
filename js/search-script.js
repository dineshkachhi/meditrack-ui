document.addEventListener('DOMContentLoaded', function () {
    // HSN Field
    const hsnInput = document.getElementById("hsn-search");
    const hsnSuggestions = document.createElement("ul");
    hsnSuggestions.id = "hsn-suggestions";  // Set ID for suggestions list
    document.querySelector(".form-group").appendChild(hsnSuggestions); // Add the suggestions list to the DOM

    // Event listener for the HSN input field
    hsnInput.addEventListener('input', async function() {
        const query = hsnInput.value.trim();

        // Only search after 1 character
        if (query.length < 1) {
            hsnSuggestions.style.display = 'none'; // Hide suggestions if less than 1 character
            return;
        }

        try {
            const response = await fetch(`/api/products/hsn/${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const suggestions = await response.json();

                if (suggestions.length > 0) {
                    // Clear existing suggestions
                    hsnSuggestions.innerHTML = "";

                    // Show the suggestions dropdown
                    hsnSuggestions.style.display = 'block';

                    // Add each suggestion to the dropdown
                    suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('li');
                        suggestionItem.textContent = suggestion.hsn;  // Display HSN value
                        suggestionItem.addEventListener('click', function() {
                            hsnInput.value = suggestion.hsn; // Set input value to selected suggestion
                            hsnSuggestions.style.display = 'none'; // Hide suggestions after selection
                        });
                        hsnSuggestions.appendChild(suggestionItem);
                    });
                } else {
                    hsnSuggestions.style.display = 'none'; // Hide if no suggestions found
                }
            } else {
                console.error("Error fetching suggestions:", response.statusText);
                hsnSuggestions.style.display = 'none'; // Hide if API call fails
            }
        } catch (error) {
            console.error("Error making API request:", error);
            hsnSuggestions.style.display = 'none'; // Hide if an error occurs
        }
    });

    // Product Name Field
    const productNameInput = document.getElementById("productName-search");
    const productNameSuggestions = document.createElement("ul");
    productNameSuggestions.id = "productName-suggestions";  // Set ID for suggestions list
    document.querySelector(".form-group").appendChild(productNameSuggestions); // Add the suggestions list to the DOM

    // Event listener for the product name input field
    productNameInput.addEventListener('input', async function() {
        const query = productNameInput.value.trim();

        // Only search after 1 character
        if (query.length < 1) {
            productNameSuggestions.style.display = 'none'; // Hide suggestions if less than 1 character
            return;
        }

        try {
            const response = await fetch(`/api/products/productName/${query}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const suggestions = await response.json();

                if (suggestions.length > 0) {
                    // Clear existing suggestions
                    productNameSuggestions.innerHTML = "";

                    // Show the suggestions dropdown
                    productNameSuggestions.style.display = 'block';

                    // Add each suggestion to the dropdown
                    suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('li');
                        suggestionItem.textContent = suggestion.productName;  // Display Product Name
                        suggestionItem.addEventListener('click', function() {
                            productNameInput.value = suggestion.productName; // Set input value to selected suggestion
                            productNameSuggestions.style.display = 'none'; // Hide suggestions after selection
                        });
                        productNameSuggestions.appendChild(suggestionItem);
                    });
                } else {
                    productNameSuggestions.style.display = 'none'; // Hide if no suggestions found
                }
            } else {
                console.error("Error fetching suggestions:", response.statusText);
                productNameSuggestions.style.display = 'none'; // Hide if API call fails
            }
        } catch (error) {
            console.error("Error making API request:", error);
            productNameSuggestions.style.display = 'none'; // Hide if an error occurs
        }
    });



    // Event listener for search button click
    document.getElementById("search-btn").addEventListener("click", async () => {
        const hsn = document.getElementById("hsn-search").value;
        const productName = document.getElementById("productName-search").value;
        const batch = document.getElementById("batch-search").value;
        const category = document.getElementById("category-search").value;

        const rate = document.getElementById("rate-search").value ? parseFloat(document.getElementById("rate-search").value) : null;
        const mrp = document.getElementById("mrp-search").value ? parseFloat(document.getElementById("mrp-search").value) : null;
        const quantity = document.getElementById("quantity-search").value ? parseInt(document.getElementById("quantity-search").value) : null;

        console.log("Search values:", { hsn, productName, batch, category, rate, mrp, quantity });

        document.getElementById('search-btn').disabled = true;
        document.getElementById('search-btn').textContent = 'Searching...';

        try {
            const queryParams = new URLSearchParams();
            if (hsn) queryParams.append("hsn", hsn);
            if (productName) queryParams.append("productName", productName);
            if (batch) queryParams.append("batch", batch);
            if (category) queryParams.append("category", category);
            if (rate !== null) queryParams.append("rate", rate);
            if (mrp !== null) queryParams.append("mrp", mrp);
            if (quantity !== null) queryParams.append("quantity", quantity);

            const response = await fetch(`/api/products/search?${queryParams.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const products = await response.json();
                console.log("Search results:", products);
                renderProducts(products);
            } else {
                console.log("Failed to fetch products:", response.statusText);
                alert("Error: Could not fetch products.");
            }
        } catch (error) {
            console.error("Error making search request:", error);
            alert("An error occurred during the search.");
        } finally {
            document.getElementById('search-btn').disabled = false;
            document.getElementById('search-btn').textContent = 'Search';
        }
    });

    // Function to render products in the table
    function renderProducts(products) {
        const tableBody = document.querySelector("#product-table tbody");
        tableBody.innerHTML = "";

        if (products.length === 0) {
            const row = `
                <tr>
                    <td colspan="9" class="text-center">No products found</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
            return;
        }

        products.forEach((product) => {
            const row = `
                <tr>
                    <td>${product.hsn}</td>
                    <td>${product.productName}</td>
                    <td>${product.batch}</td>
                    <td>${product.mrp}</td>
                    <td>${product.rate}</td>
                    <td>${product.exp}</td>
                    <td>${product.quantity}</td>
                    <td>${product.category}</td>
                    <td>${product.productGeneralName}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    }
});
