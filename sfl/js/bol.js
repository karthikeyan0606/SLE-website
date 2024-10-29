function generateInvoiceNumber() {
    document.getElementById('invoiceNumber').value = 'INV' + Date.now();
}





let serialNumber = 2;

function addCargoItem() {
    const cargoItemsSection = document.getElementById('cargoItemsSection');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `<td><input type="text" class="form-control itemSerialNumber" value="${serialNumber++}" readonly></td>
        <td><input type="text" class="form-control itemDescription" placeholder="Enter Item Description" required></td>
        <td><input type="number" class="form-control itemQuantity" placeholder="Enter Quantity" required></td>
        <td>
            <select class="form-control itemUnit" required>
                <option value="BAG">BAG</option>
                <option value="PCS">PCS</option>
                <option value="PKT">PKT</option>
                <option value="DOZ">DOZ</option>
                <option value="KGS">KGS</option>
                <option value="SET">SET</option>
            </select>
        </td>
        <td><input type="text" class="form-control hsnCode" placeholder="Enter HSN Code" required></td>
        <td><input type="number" class="form-control unitPrice" placeholder="Price" required></td>
        <td><input type="text" class="form-control itemTotal" readonly></td>
    `;

    cargoItemsSection.appendChild(newRow);

    // Add event listeners to calculate the total when quantity or unit price changes
    const itemQuantity = newRow.querySelector('.itemQuantity');
    const unitPrice = newRow.querySelector('.unitPrice');
    const itemTotal = newRow.querySelector('.itemTotal');

    function fieldTotal() {
        const quantity = parseFloat(itemQuantity.value) || 0;
        const price = parseFloat(unitPrice.value) || 0;
        itemTotal.value = (quantity * price).toFixed(2); // Set total with two decimal places
    }

    itemQuantity.addEventListener('input', fieldTotal);
    unitPrice.addEventListener('input', fieldTotal);
}


// Function to add a new cargo item row
// function addCargoItem() {
//     const table = document.getElementById('cargoItemsSection');
//     const row = table.querySelector('tr').cloneNode(true);
//     const itemNumber = table.querySelectorAll('tr').length + 1;
//     row.querySelector('.itemSerialNumber').value = itemNumber;
//     row.querySelectorAll('input').forEach(input => input.value = '');
//     table.appendChild(row);
// }

// function calculateTotal() {
//     const quantities = document.querySelectorAll('.itemQuantity');
//     const unitPrices = document.querySelectorAll('.unitPrice');
//     const itemTotals = document.querySelectorAll('.itemTotal');
//     let totalCost = 0;
//     let totalWeight = 0;

//     quantities.forEach((quantity, index) => {
//         const qty = parseFloat(quantity.value) || 0;
//         const price = parseFloat(unitPrices[index].value) || 0;
//         const itemTotal = qty * price;
//         itemTotals[index].value = itemTotal.toFixed(2);

//         totalWeight += qty;
//         totalCost += itemTotal;
//     });

//     document.getElementById('totalWeight').value = totalWeight;
//     document.getElementById('totalCost').value = totalCost.toFixed(2);
//     document.getElementById('totalCostWords').textContent = numberToWords(totalCost) + ' Rupees';
// }

// function clearForm() {
//     document.querySelectorAll('input').forEach(input => input.value = '');
//     document.getElementById('totalCostWords').textContent = '';
//     serialNumber = 1;
//     generateInvoiceNumber();
//     document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
// }

// function numberToWords(number) {
//     // implementation of numberToWords function
// }

// function downloadPDF() {
//     window.print(); // Trigger print which can be saved as PDF
// }

document.addEventListener('DOMContentLoaded', () => {
    generateInvoiceNumber();
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
});



// Function to convert numbers to words (Indian Numbering System)
function numberToWords(num) {
    const words = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen",
        "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Lakh", "Crore"];

    if (num === 0) return "Zero";

    let result = "";
    let scale = 0;

    while (num > 0) {
        const part = num % 1000;

        if (part) {
            let partWords = "";
            const hundreds = Math.floor(part / 100);
            const remainder = part % 100;

            if (hundreds) {
                partWords += `${words[hundreds]} Hundred `;
            }
            if (remainder < 20) {
                partWords += words[remainder];
            } else {
                partWords += `${tens[Math.floor(remainder / 10)]} ${words[remainder % 10]}`;
            }

            result = `${partWords.trim()} ${scales[scale]} ${result}`.trim();
        }

        num = Math.floor(num / 1000);
        scale += 1;
    }

    return result.trim();
}

// Function to update item total when quantity and unit price are entered
function updateItemTotal(row) {
    const quantity = parseFloat(row.querySelector('.itemQuantity').value) || 0;
    const unitPrice = parseFloat(row.querySelector('.unitPrice').value) || 0;
    const total = quantity * unitPrice;
    row.querySelector('.itemTotal').value = total.toFixed(2);
}





// Function to calculate the total weight and total cost
function calculateTotal() {
    let totalWeight = 0;
    let totalCost = 0;

    document.querySelectorAll('#cargoItemsSection tr').forEach(row => {
        const quantity = parseFloat(row.querySelector('.itemQuantity').value) || 0;
        const unitPrice = parseFloat(row.querySelector('.unitPrice').value) || 0;
        const weightPerItem = 1; // Assuming each item has a weight of 1 kg for example

        totalWeight += quantity * weightPerItem;
        totalCost += quantity * unitPrice;
        updateItemTotal(row);
    });

    document.getElementById('totalWeight').value = totalWeight.toFixed(2);
    document.getElementById('totalCost').value = totalCost.toFixed(2);
    document.getElementById('totalCostWords').textContent = numberToWords(totalCost) + " Rupees";
}

// Function to clear the form
function clearForm() {
    document.querySelectorAll('.form-control').forEach(input => input.value = '');
    document.getElementById('totalCostWords').textContent = "";
}

// Attach event listeners for dynamic calculation
document.getElementById('cargoItemsSection').addEventListener('input', event => {
    const row = event.target.closest('tr');
    if (row) updateItemTotal(row);
});
