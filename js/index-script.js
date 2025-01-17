
/*    const ctx = document.getElementById('productPieChart').getContext('2d');
    const productPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Electronics', 'Clothing', 'Furniture', 'Others'],
            datasets: [{
                data: [50, 30, 10, 10],
                backgroundColor: ['#ff5733', '#33ff57', '#3357ff', '#f4c542']
            }]
        }
    });*/

// Function to generate an Excel file template
document.getElementById('download-template-btn').addEventListener('click', () => {
    const dummyData = [
        {
            hsn: '123456',
            productName: 'Vitamins Tab',
            batch: 'VI-A001',
            mrp: 100.00,
            rate: 80.00,
            exp: '2025-12-31',
            quantity: 50,
            category: 'Vitamins',
            productGeneralName: 'Test General Product'
        }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dummyData);
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Create a Blob object for the file and trigger download
    const blob = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const buffer = new ArrayBuffer(blob.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < blob.length; i++) {
        view[i] = blob.charCodeAt(i) & 0xFF;
    }

    const blobFile = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blobFile);
    link.download = "product-upload-template.xlsx";
    link.click();
});




document.getElementById("excel-file").addEventListener("change", () => {
    // Clear previous success or error message when a new file is selected
    const messageContainer = document.getElementById('message');
    messageContainer.textContent = ''; // Clear the message
    document.getElementById('message-icon').innerHTML = ''; // Clear the icon
});

document.getElementById("upload-btn").addEventListener("click", async () => {
    const fileInput = document.getElementById("excel-file");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("https://dual-zsazsa-meditrack-7e0ead8a.koyeb.app/api/products/upload", {
            method: "POST",
            body: formData,
        });

        const messageContainer = document.getElementById('message'); // Get message container
        const messageIcon = document.getElementById('message-icon'); // Get the icon container

        if (response.ok) {
            const message = await response.text();
            messageContainer.textContent = message;  // Display success message
            messageContainer.style.color = "green"; // Set text color to green for success
            messageIcon.innerHTML = '✔';  // Display checkmark icon for success
            messageIcon.style.color = "green"; // Set icon color to green

            // Clear the file input after successful upload
            fileInput.value = '';  // Reset the file input field

        } else {
            const errorResponse = await response.text();  // Capture the error message from API
            console.error("Error uploading file:", errorResponse);
            messageContainer.textContent = errorResponse;  // Display API error message
            messageContainer.style.color = "red"; // Set text color to red for error
            messageIcon.innerHTML = '✖';  // Display cross icon for failure
            messageIcon.style.color = "red"; // Set icon color to red
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        const messageContainer = document.getElementById('message');
        const messageIcon = document.getElementById('message-icon');
        messageContainer.textContent = error.message || 'Error uploading file.';  // Display error message
        messageContainer.style.color = "red"; // Set text color to red for error
        messageIcon.innerHTML = '✖';  // Display cross icon for failure
        messageIcon.style.color = "red"; // Set icon color to red
    }
});


// Function to fetch data from the backend and render the pie chart
async function loadAndRenderPieChart() {
    try {
        // Fetch data from the backend API
        const response = await fetch('https://dual-zsazsa-meditrack-7e0ead8a.koyeb.app/api/products/pia-data');
        if (!response.ok) {
            throw new Error('Failed to fetch category data');
        }
        // Parse the JSON response
        const data = await response.json();
        // Extract labels and quantities from the response
        const labels = data.labels;
        const quantities = data.quantities;
        // Render the pie chart
        const ctx = document.getElementById('productPieChart').getContext('2d');
        // Destroy existing chart if it exists to prevent overlapping
        if (window.productPieChart) {
          //  window.productPieChart.destroy();
        }
        // Create a new pie chart
        window.productPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: quantities,
                    backgroundColor: generateRandomColors(labels.length)
                }]
            }
        });
    } catch (error) {
        console.error('Error loading and rendering pie chart:', error);
    }
}

// Function to generate sequential colors from low wavelength (blue) to high wavelength (red)
function generateRandomColors(count) {
    const colors = [];
    const hueStart = 200; // Blue
    const hueEnd = 0; // Red

    // Generate colors based on the range of hues
    for (let i = 0; i < count; i++) {
        const hue = hueStart - (i / (count - 1)) * (hueStart - hueEnd); // Calculate the hue value for the color
        const color = `hsl(${hue}, 100%, 50%)`; // Full saturation and 50% lightness for vibrant colors
        colors.push(color);
    }

    return colors;
}


// Call the function on page load
window.onload = loadAndRenderPieChart;







