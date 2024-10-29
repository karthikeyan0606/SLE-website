
let serialNumber = 2;

// Set current date
document.getElementById("currentDate").textContent = new Date().toLocaleDateString();

// Generate a random bill number
const year = new Date().getFullYear();
const randomBillNumber = `${year}-${Math.floor(10000 + Math.random() * 90000)}`;
document.getElementById("billNo").textContent = randomBillNumber;

// Function to add a new cargo item row
 // Function to add cargo items
 function addCargoItem() {
    const newRow = document.createElement('tr');
    const itemCount = document.querySelectorAll('.itemSerialNumber').length + 1;
    newRow.innerHTML = `
        <td><input type="text" class="form-control itemSerialNumber" value="${itemCount}" readonly></td>
        <td>
            <input type="text" class="form-control itemDescription" placeholder="Enter Item Description" required>
            <span class="itemDescriptionError text-danger" style="display: none;">* Description is required</span>
        </td>
        <td>
            <input type="number" class="form-control itemQuantity" placeholder="Enter Quantity" oninput="calculateTotal(this)" required>
            <span class="itemQuantityError text-danger" style="display: none;">* Quantity is required</span>
        </td>
        <td>
            <input type="text" class="form-control itemUnit" placeholder="Enter Unit" required>
            <span class="itemUnitError text-danger" style="display: none;">* Unit is required</span>
        </td>
        <td>
            <input type="text" class="form-control hsnCode" placeholder="Enter HSN Code" required>
            <span class="hsnCodeError text-danger" style="display: none;">* HSN Code is required</span>
        </td>
        <td>
            <input type="number" class="form-control unitPrice" placeholder="Price" oninput="calculateTotal(this)" required>
            <span class="unitPriceError text-danger" style="display: none;">* Unit Price is required</span>
        </td>
        <td><input type="text" class="form-control itemTotal" readonly></td>
    `;
    document.getElementById('cargoItemsSection').appendChild(newRow);
}

// Calculate the total for each row and update the grand total
function calculateTotal(element) {
    const row = element.closest('tr');
    const quantity = row.querySelector('.itemQuantity').value || 0;
    const unitPrice = row.querySelector('.unitPrice').value || 0;
    const total = quantity * unitPrice;
    row.querySelector('.itemTotal').value = total.toFixed(2);
    updateGrandTotal();
}

// Update grand total by summing up all item totals
function updateGrandTotal() {
    const totals = document.querySelectorAll('.itemTotal');
    let grandTotal = 0;
    totals.forEach(total => {
        grandTotal += parseFloat(total.value) || 0;
    });
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
    document.getElementById('grandTotalWords').textContent = numberToWords(grandTotal) + " Rupees Only";
}




// Number to words total
function numberToWords(number) {
    const units = ['', 'Thousand', 'Lakh', 'Crore'];
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (number === 0) return 'Zero Rupees Only';

    let numStr = number.toString();
    let numWords = '';
    let position = 0;

    let [rupees, paise] = number.toFixed(2).split('.'); // Split the rupee and paise parts
    rupees = parseInt(rupees);
    paise = parseInt(paise);


    while (numStr.length > 0) {
        let part = 0;
        if (position === 1 || position >= 2) {
            part = parseInt(numStr.slice(-2));
            numStr = numStr.slice(0, -2);
        } else {
            part = parseInt(numStr.slice(-3));
            numStr = numStr.slice(0, -3);
        }

        if (part > 0) {
            let partWords = '';

            if (part >= 100) {
                partWords += ones[Math.floor(part / 100)] + ' Hundred ';
                part %= 100;
            }

            if (part >= 20) {
                partWords += tens[Math.floor(part / 10)] + ' ';
                part %= 10;
            } else if (part >= 10) {
                partWords += teens[part - 10] + ' ';
                part = 0;
            }

            partWords += ones[part];
            numWords = partWords.trim() + ' ' + units[position] + ' ' + numWords;
        }

        position++;
    }

    return numWords.trim() + '';
}



function updateGrandTotalWords() {
    const grandTotal = parseFloat(document.getElementById('grandTotal').textContent) || 0;
    document.getElementById('grandTotalWords').textContent = numberToWords(grandTotal);
}






// Call updateGrandTotalWords whenever grand total is updated
window.onload = updateGrandTotalWords;



function saveData() {
    const items = [];
    document.querySelectorAll('#cargoItemsTable tbody tr').forEach(row => {
        const item = {
            description: row.querySelector('.itemDescription').value,
            quantity: row.querySelector('.itemQuantity').value,
            unit: row.querySelector('.itemUnit').value,
            hsnCode: row.querySelector('.hsnCode').value,
            unitPrice: row.querySelector('.unitPrice').value,
            total: row.querySelector('.itemTotal').value
        };
        items.push(item);
    });
    const data = {
        billNo: document.getElementById('billNo').textContent,
        date: document.getElementById('currentDate').textContent,
        transport: document.getElementById('transport').value,
        pol: document.getElementById('pol').value,
        pod: document.getElementById('pod').value,
        grandTotal: document.getElementById('grandTotal').textContent,
        grandTotalWords: document.getElementById('grandTotalWords').textContent,
        items
    };
    console.log("Saved Data: ", JSON.stringify(data, null, 2));
}
// DOWNLOAD PDF
// image format pdf. it not selectable text
function downloadPDF() {
    // Save current input values
    const inputs = document.querySelectorAll('input, textarea');
    const values = Array.from(inputs).map(input => input.value);

    // Replace input fields with their values for PDF view
    inputs.forEach((input, index) => {
        const span = document.createElement("span");
        span.textContent = values[index];
        span.style.display = "block";
        span.className = "pdf-text";
        input.parentNode.replaceChild(span, input);
    });

    // Hide unnecessary elements like buttons
    document.querySelectorAll("button").forEach(button => button.style.display = "none");

    // Hide table borders and show text as selectable
    document.querySelectorAll("table").forEach(table => {
        table.style.border = "none";
        table.querySelectorAll("tr, td, th").forEach(cell => {
            cell.style.border = "none";
            cell.style.padding = "2px 0"; // Adjust for better layout
        });
    });

    // Get bill number for the filename
    const billNumber = document.getElementById('billNo').textContent || "invoice";

    // Set up options for PDF generation with bill number as filename
    const options = {
        margin: 0.5,
        filename: `${billNumber}.pdf`,  // Use bill number as filename
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generate PDF
    html2pdf().from(document.body).set(options).save().then(() => {
        // Restore original elements after PDF generation
        document.querySelectorAll(".pdf-text").forEach((span, index) => {
            const input = document.createElement(inputs[index].tagName.toLowerCase());
            input.value = span.textContent;
            input.className = inputs[index].className;
            input.type = inputs[index].type;
            span.parentNode.replaceChild(input, span);
        });

        // Show hidden elements
        document.querySelectorAll("button").forEach(button => button.style.display = "inline-block");

        // Restore table borders
        document.querySelectorAll("table").forEach(table => {
            table.style.border = ""; // Reset table borders
            table.querySelectorAll("tr, td, th").forEach(cell => {
                cell.style.border = ""; // Reset cell borders
                cell.style.padding = ""; // Reset padding
            });
        });
    });
}




// Call updateGrandTotalWords whenever grand total is updated
window.onload = updateGrandTotalWords;


































































































// function downloadPDF() {
//     // Save current input values
//     const inputs = document.querySelectorAll('input, textarea');
//     const values = Array.from(inputs).map(input => input.value);

//     // Replace input fields with their values for PDF view
//     inputs.forEach((input, index) => {
//         const span = document.createElement("span");
//         span.textContent = values[index];
//         span.style.display = "block";
//         span.className = "pdf-text";
//         input.parentNode.replaceChild(span, input);
//     });

//     // Hide unnecessary elements like buttons
//     document.querySelectorAll("button").forEach(button => button.style.display = "none");

//     // Add watermark logo
//     const watermark = document.createElement("img");
//     watermark.src = 'images/logo2.png'; // Replace with the path to your logo
//     watermark.className = "watermark";
//     watermark.style.position = "fixed";
//     watermark.style.top = "50%";
//     watermark.style.left = "50%";
//     watermark.style.transform = "translate(-50%, -50%)";
//     watermark.style.opacity = "0.1"; // Set transparency
//     watermark.style.width = "80%";   // Adjust as needed
//     watermark.style.pointerEvents = "none"; // Prevents interaction
//     document.body.appendChild(watermark);

//     // Set up options for pdf generation
//     const options = {
//         margin: 0.5,
//         filename: 'invoice.pdf',
//         image: { type: 'jpeg', quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//     };

//     // Generate PDF
//     html2pdf().from(document.body).set(options).save().then(() => {
//         // Restore original elements after PDF generation
//         document.querySelectorAll(".pdf-text").forEach((span, index) => {
//             const input = document.createElement(inputs[index].tagName.toLowerCase());
//             input.value = span.textContent;
//             input.className = inputs[index].className;
//             input.type = inputs[index].type;
//             span.parentNode.replaceChild(input, span);
//         });

//         // Show hidden elements
//         document.querySelectorAll("button").forEach(button => button.style.display = "inline-block");

//         // Remove the watermark
//         watermark.remove();
//     });
// }


