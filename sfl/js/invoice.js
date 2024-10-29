// Add a new cargo item row
function addCargoItem() {
    const cargoItemsSection = document.getElementById('cargoItemsSection');
    const newItem = document.createElement('div');
    newItem.classList.add('row', 'cargo-item', 'mt-3');
    newItem.innerHTML = `
        <div class="col-md-4">
            <input type="text" class="form-control itemDescription" placeholder="Enter Item Description" required>
        </div>
        <div class="col-md-4">
            <input type="number" class="form-control itemQuantity" placeholder="Enter Quantity" required>
        </div>
        <div class="col-md-4">
            <input type="number" class="form-control itemWeight" placeholder="Enter Weight" required>
        </div>`;
    cargoItemsSection.appendChild(newItem);

    // Attach event listener to calculate total on input change
    updateCalculationListeners();
}

// Calculate total weight and cost as data is entered
function calculateTotal() {
    let totalWeight = 0;
    let totalCost = 0;
    const weights = document.querySelectorAll('.itemWeight');
    const quantities = document.querySelectorAll('.itemQuantity');

    weights.forEach((weight, index) => {
        const quantity = quantities[index].value || 1;
        totalWeight += parseFloat(weight.value) * parseInt(quantity);
        totalCost += parseFloat(weight.value) * parseInt(quantity) * 10; // assuming $10 per kg
    });

    document.getElementById('totalWeight').value = totalWeight.toFixed(2);
    document.getElementById('totalCost').value = totalCost.toFixed(2);
}

// Attach calculation event listeners to each input field
function updateCalculationListeners() {
    const inputs = document.querySelectorAll('.itemQuantity, .itemWeight');
    inputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
}

// Clear the form
function clearForm() {
    document.querySelectorAll('.itemDescription, .itemQuantity, .itemWeight').forEach(input => input.value = '');
    document.getElementById('totalWeight').value = '';
    document.getElementById('totalCost').value = '';
    alert('Form Cleared!');
}

// Initial event listener attachment
updateCalculationListeners();
