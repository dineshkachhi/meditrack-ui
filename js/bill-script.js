
    // Call this function when the page loads
    window.onload = function() {
    // Call the function on page loadō
        checkLoginStatus();  // Check if the user is logged in
    };
    // Product Name Field
    const searchInputField = document.getElementById("searchInput");
    const searchInputSuggestions = document.createElement("ul");
    searchInputSuggestions.id = "productName-suggestions";  // Set ID for suggestions list
    document.querySelector(".search").appendChild(searchInputSuggestions); // Add the suggestions list to the DOM

    // Event listener for the product name input field
    searchInputField.addEventListener('input', async function() {
        const query = searchInputField.value.trim();

        // Only search after 1 character
        if (query.length < 1) {
            searchInputSuggestions.style.display = 'none'; // Hide suggestions if less than 1 character
            return;
        }

        try {
         const tokenObj = JSON.parse(localStorage.getItem('jwtToken'));
         const token = tokenObj.token; // Access the token from the objectō

             var FINAL_URL = HOSTNAME + '/api/products/productSearch/';

            const response = await fetch(FINAL_URL+ query, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const suggestions = await response.json();

                if (suggestions.length > 0) {
                    // Clear existing suggestions
                    searchInputSuggestions.innerHTML = "";

                    // Show the suggestions dropdown
                    searchInputSuggestions.style.display = 'block'; // Make sure the suggestions are displayed

                    // Add each suggestion to the dropdown
                    suggestions.forEach(suggestion => {
                        const suggestionItem = document.createElement('li');
                    suggestionItem.textContent =
                        suggestion.productName +
                        ', Category:- ' + suggestion.category +
                        ', GeneralName:- ' + suggestion.productGeneralName +
                        ', Batch:- ' + suggestion.batch +
                        ', Hsn:- ' + suggestion.hsn;

                        // Store the internal ID (primary key) in a data attribute
                        suggestionItem.setAttribute('data-id', suggestion.id);

                        suggestionItem.addEventListener('click', function() {
                            // Set the input value to the product name
                            searchInputField.value = suggestion.productName;

                            // Use the ID in place of the name for searching
                            searchInputField.setAttribute('data-id', suggestion.id);

                        // Hide suggestions after selection
                        searchInputSuggestions.style.display = 'none';

                        // Call the selection handler function
                         searchItems();
                       // handleSuggestionSelection(suggestion.id);
                        });
                        searchInputSuggestions.appendChild(suggestionItem);
                    });
                } else {
                    searchInputSuggestions.style.display = 'none'; // Hide if no suggestions found
                }
            } else {
                console.error("Error fetching suggestions:", response.statusText);
                searchInputSuggestions.style.display = 'none'; // Hide if API call fails
            }
        } catch (error) {
            console.error("Error making API request:", error);
            searchInputSuggestions.style.display = 'none'; // Hide if an error occurs
        }
    });



    const clearButton = document.getElementById("clearButton");  // Reference to the clear button
    // Show or hide the clear button based on input field content
    searchInputField.addEventListener('input', function () {
        if (searchInputField.value.trim() !== '') {
            clearButton.style.display = 'inline-block'; // Show clear button
        } else {
            clearButton.style.display = 'none'; // Hide clear button
        }
    });

    // Clear the search input field and reset related values when the clear button is clicked
    clearButton.addEventListener('click', function () {
        searchInputField.value = '';  // Clear the search input
        clearButton.style.display = 'none';  // Hide the clear button
        searchInputSuggestions.innerHTML = '';  // Clear suggestions
        searchInputSuggestions.style.display = 'none'; // Hide suggestions dropdown
        searchInputField.setAttribute('data-id', ''); // Reset the ID attribute (if used)
    });

    // Add the rest of your existing code for fetching suggestions and search functionality here


// Attach an event listener to detect the Enter key press
    searchInputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        searchItems(); // Trigger the search function
    }
});

    // Array to store selected items
    let selectedItems = [];

// Search items by calling the API
async function searchItems() {
        const searchText = document.getElementById('searchInput').value;
        const searchId = document.getElementById('searchInput').getAttribute('data-id'); // Get the internal ID

        if (!searchText && !searchId) {
            alert('Please enter a search term or select an item!');
        return;
    }

        const searchQuery = searchId || searchText; // Use the ID if available, otherwise use the text

    try {
          const tokenObj = JSON.parse(localStorage.getItem('jwtToken'));
          const token = tokenObj.token; // Access the token from the objectō
          var FINAL_URL = HOSTNAME + '/api/products/';
            const response = await fetch(FINAL_URL+ searchQuery, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`, // Add the token in the Authorization header
                    "Content-Type": "application/json",
                },
            });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const products = await response.json();

        const resultsTable = document.getElementById('resultsTable');
        resultsTable.innerHTML = ''; // Clear previous results

        if (products.length === 0) {
            resultsTable.innerHTML = '<tr><td colspan="12">No results found.</td></tr>';
            return;
        }

        // Create table headers
        const headerRow = `
            <tr>
                <th>HSN</th>
                <th>Product Name</th>
                <th>Batch</th>
                <th>MRP</th>
                <th>Rate</th>
                <th>Expiry</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Product General Name</th>
                <th>Created Date</th>
                <th>Action</th>
            </tr>`;
        resultsTable.innerHTML = headerRow;

        // Add rows for each product
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.hsn || '-'}</td>
                <td>${product.productName}</td>
                <td>${product.batch}</td>
                <td>${product.mrp.toFixed(2)}</td>
                <td>${product.rate.toFixed(2)}</td>
                <td>${product.exp || '-'}</td>
                <td>${product.quantity}</td>
                <td>${product.category}</td>
                <td>${product.productGeneralName}</td>
                <td>${product.createdDate || '-'}</td>
                <td><button class="add-btn" data-id="${product.id}">Add</button></td>
            `;
            const addButton = row.querySelector('.add-btn');
            addButton.addEventListener('click', () => addToBill(product));
            resultsTable.appendChild(row);
        });
    } catch (error) {
     //   console.error('Error fetching search results:', error);
        alert('Failed to fetch search results. Please try again.');
    }
}

// Add selected item to the bill
function addToBill(product) {
    // Check if the product with the same id is already in the bill
    if (selectedItems.some(item => item.id === product.id)) {
        alert('Item already added to the bill.');
        return;
    }

    // Add the product to the selectedItems array
    selectedItems.push({ ...product, selectedQuantity: 1, selectedRate: product.rate });

    const billTableBody = document.querySelector('#billTable tbody');
    const row = document.createElement('tr');
    row.setAttribute('data-id', product.id); // Add data-id to the row for easier deletion
    row.innerHTML = `
        <td>${product.hsn || '-'}</td>
        <td>${product.productName}</td>
        <td>${product.batch}</td>
        <td>${product.mrp.toFixed(2)}</td>
        <td>
            <input type="number" class="rate-input" value="${product.rate.toFixed(1)}" min="0" step="1"
                   data-id="${product.id}" onchange="updateRate(${product.id})">
        </td>
        <td>${product.exp || '-'}</td>
        <td><input type="number" class="quantity-input" value="1" min="1" max="${product.quantity}" data-id="${product.id}" onchange="updateQuantity(${product.id})"></td>
        <td>${product.category}</td>
        <td>${product.productGeneralName}</td>
        <td>${product.createdDate || '-'}</td>
        <td><button class="delete-btn" data-id="${product.id}">Delete</button></td>
    `;
    billTableBody.appendChild(row);

    // Add delete button functionality
    const deleteButton = row.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => removeFromBill(product.id));

}



function updateRate(productId) {
    const input = document.querySelector(`.rate-input[data-id="${productId}"]`);
    const rate = parseFloat(input.value);
    const product = selectedItems.find(item => item.id === productId);

    if (rate < 0) {
        alert('Rate cannot be negative.');
        input.value = product.selectedRate.toFixed(2); // Reset to the previous rate
        return;
    }

    if (rate > product.mrp) {
        alert('Rate cannot be greater than MRP.');
        input.value = product.selectedRate.toFixed(2); // Reset to the previous rate
        return;
    }

    product.selectedRate = rate; // Update the selected rate in the array
}

function updateQuantity(productId) {
    const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
    const quantity = parseInt(input.value, 10);
    const product = selectedItems.find(item => item.id === productId);

    if (quantity < 1) {
        alert('Quantity must be at least 1.');
        input.value = product.selectedQuantity; // Reset to the previous quantity
        return;
    }

    if (quantity > product.quantity) {
        alert('Quantity cannot exceed the available stock.');
        input.value = product.selectedQuantity; // Reset to the previous quantity
        return;
    }

    product.selectedQuantity = quantity; // Update the selected quantity in the array
}


// Remove item from the bill
function removeFromBill(productId) {
    // Find the product by id and remove it from selectedItems
    selectedItems = selectedItems.filter(item => item.id !== productId);

    // Remove the row from the bill table
    const billTableBody = document.querySelector('#billTable tbody');
    const row = billTableBody.querySelector(`tr[data-id="${productId}"]`);
    if (row) {
        row.remove();
    }
}

// Generate bill with customer details and make API call
async function generateBill() {
    // Validate selected items
    if (selectedItems.length === 0) {
        alert('No items selected for the bill.');
        return;
    }

    // Get and validate customer details
    const customerDetails = getCustomerDetails();
    if (!customerDetails) {
        alert('Customer details are required.');
        return;
    }

    // Calculate total quantity and amount
    const { totalQuantity, totalAmount } = calculateTotals(selectedItems);

    // Prepare bill data
    const billData = {
        customerDetails,
        items: formatItems(selectedItems),
        totalAmount,
        totalQuantity,
    };

    // Store bill data in localStorage (optional)
    localStorage.setItem('billData', JSON.stringify(billData));

    try {
        // Retrieve the JWT token
        const tokenObj = JSON.parse(localStorage.getItem('jwtToken'));
        const token = tokenObj?.token;

        if (!token) {
            alert('Authentication token is missing. Please log in again.');
            return;
        }

        // Make the API call to generate the bill
        var FINAL_URL = HOSTNAME + '/api/products/generateBill';
        const response = await fetch(FINAL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(billData),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate bill: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Bill generated successfully:', data);

        // Redirect to the view-bill.html page
        window.location.href = '/meditrack-ui/view-bill.html';
    } catch (error) {
        console.error('Error generating bill:', error);
        alert('Failed to generate bill. Please try again.');
    }
}

// Helper function to calculate totals
function calculateTotals(items) {
    return items.reduce(
        (totals, item) => {
            totals.totalQuantity += item.selectedQuantity;
            totals.totalAmount += item.selectedRate * item.selectedQuantity;
            return totals;
        },
        { totalQuantity: 0, totalAmount: 0 }
    );
}

// Helper function to format items
function formatItems(items) {
    return items.map(item => ({
        productId: item.id,
        selectedQuantity: item.selectedQuantity,
        selectedRate: item.selectedRate
    }));
}

// Function to capture additional customer details
function getCustomerDetails() {
    const name = document.getElementById('customerName').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const mobile = document.getElementById('customerMobile').value.trim();
    const remarks = document.getElementById('customerRemarks').value.trim();

    const paymentOption = document.querySelector('input[name="paymentOption"]:checked').value;

    if ( !mobile) {
        alert("Mobile is required fields.");
        return null;
    }

    return {
        name,
        address,
        mobile,
        remarks,
        paymentOption
    };
}
