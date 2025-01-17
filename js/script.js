// create-label.js
document.addEventListener('DOMContentLoaded', function () {
    const labels = {
        companyName: "ABC Medical Store",
        address: "1234, Medical Lane, City, State",
        formTitle: "Create Products",
        hsnLabel: "HSN:",
        productNameLabel: "Product Name:",
        batchLabel: "Batch:",
        mrpLabel: "MRP:",
        rateLabel: "Rate:",
        expLabel: "Expiry Date:",
        quantityLabel: "Quantity:",
        categoryLabel: "Category:",
        generalNameLabel: "General Name:",
        addProductButton: "Add Product",
        saveButton: "Save All Products",
        footerContact: "For urgent contact, call us at: +91 123 456 7890 | Email: contact@abmedstore.com"
    };

    document.getElementById('company-name').textContent = labels.companyName;
    document.getElementById('company-address').textContent = labels.address;
    document.getElementById('form-title').textContent = labels.formTitle;
    document.getElementById('hsn-label').textContent = labels.hsnLabel;
    document.getElementById('product-name-label').textContent = labels.productNameLabel;
    document.getElementById('batch-label').textContent = labels.batchLabel;
    document.getElementById('mrp-label').textContent = labels.mrpLabel;
    document.getElementById('rate-label').textContent = labels.rateLabel;
    document.getElementById('exp-label').textContent = labels.expLabel;
    document.getElementById('quantity-label').textContent = labels.quantityLabel;
    document.getElementById('category-label').textContent = labels.categoryLabel;
    document.getElementById('general-name-label').textContent = labels.generalNameLabel;
    document.getElementById('add-product-btn').textContent = labels.addProductButton;
    document.getElementById('save-all-btn').textContent = labels.saveButton;
    document.getElementById('footer-contact').textContent = labels.footerContact;

    });


    // Categories data (you can load this from an external JSON file if needed)
  const categories = window.categories_lookup;
    // Populate category dropdown dynamically
    const categorySelect = document.getElementById('category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
        });

     let products = [];

    document.getElementById("add-product-btn").addEventListener("click", () => {
        const product = {
            hsn: document.getElementById("hsn").value,
            productName: document.getElementById("productName").value,
            batch: document.getElementById("batch").value,
            mrp: parseFloat(document.getElementById("mrp").value),
            rate: parseFloat(document.getElementById("rate").value),
            exp: document.getElementById("exp").value,
            quantity: parseInt(document.getElementById("quantity").value),
            category: document.getElementById("category").value,
            productGeneralName: document.getElementById("productGeneralName").value,
        };

        products.push(product);
        renderProducts();
    });

    function renderProducts() {
        const tableBody = document.querySelector("#product-table tbody");
        tableBody.innerHTML = "";

        products.forEach((product, index) => {
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
                    <td>
                    <button class="edit-btn" onclick="editProduct(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                        <button class="delete-btn" onclick="deleteProduct(${index})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    // Edit Product (fill form with data)
function editProduct(index) {
    const product = products[index];
    document.getElementById("hsn").value = product.hsn;
    document.getElementById("productName").value = product.productName;
    document.getElementById("batch").value = product.batch;
    document.getElementById("mrp").value = product.mrp;
    document.getElementById("rate").value = product.rate;
    document.getElementById("exp").value = product.exp;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("category").value = product.category;
    document.getElementById("productGeneralName").value = product.productGeneralName;

    // Remove from the list after editing
    products.splice(index, 1);
    renderProducts();
}

    // Delete Product
    function deleteProduct(index) {
    products.splice(index, 1);
    renderProducts();
    }

    // Reset the form
    function resetForm() {
        document.getElementById("product-form").reset();
    }

    // Save All Products
    document.getElementById("save-all-btn").addEventListener("click", async () => {
        if (products.length === 0) {
            alert("No products to save!");
            return;
        }

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(products),
            });

            if (response.ok) {
                alert("Products saved successfully!");
            products = [];  // Clear the list after successful save
            renderProducts();  // Update the table
            resetForm();  // Reset the form fields
            } else {
            alert("Failed to save products. Please try again.");
            }
        } catch (error) {
        console.error("Error saving products:", error);
        alert("An error occurred. Check the console for details.");
        }
});
