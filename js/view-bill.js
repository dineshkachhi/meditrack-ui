// Call this function when the page loads
window.onload = function() {
// Call the function on page loadō
    checkLoginStatus();  // Check if the user is logged in
};

document.addEventListener('DOMContentLoaded', function () {
    const billData = JSON.parse(localStorage.getItem('billData'));

    if (!billData || !billData.items || billData.items.length === 0) {
        alert('No bill data found.');
        return;
    }

    // Display customer details in the top-left section
    const customerDetailsSection = document.getElementById('customerDetails');
    const customerDetails = billData.customerDetails;

    if (customerDetails) {
        customerDetailsSection.innerHTML = `
            <p><strong>Name:</strong> ${customerDetails.name}</p>
            <p><strong>Address:</strong> ${customerDetails.address || '-'}</p>
            <p><strong>Mobile:</strong> ${customerDetails.mobile}</p>
            <p><strong>Remarks:</strong> ${customerDetails.remarks || '-'}</p>
            <p><strong>Payment Option:</strong> ${customerDetails.paymentOption}</p>
        `;
    }

    const billTableBody = document.querySelector('#billTable tbody');
        let totalQuantity = 0;
        let totalAmount = 0;

    // Loop through each product and display it in the table
    billData.items.forEach(product => {
        const row = document.createElement('tr');
        const amount = product.selectedQuantity * product.selectedRate; // Calculate total amount for each item
                totalQuantity += product.selectedQuantity; // Add to total quantity
                totalAmount += amount; // Add to total amount
        row.innerHTML = `
            <td>${product.hsn || '-'}</td>
            <td>${product.productName}</td>
            <td>${product.batch}</td>
            <td>${product.mrp}</td>
            <td>${product.selectedRate}</td>
            <td>${product.exp || '-'}</td>
            <td>${product.selectedQuantity}</td>
            <td>${product.category}</td>
            <td>${product.productGeneralName}</td>
            <td>${product.createdDate || '-'}</td>
            <td>${(product.selectedRate * product.selectedQuantity).toFixed(2)}</td>
        `;
        billTableBody.appendChild(row);
    });
       // Update the total quantity and total amount in the footer
        document.getElementById('totalQuantity').textContent = totalQuantity;
        document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);


});
