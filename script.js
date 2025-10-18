// Get DOM elements
const amountSentInput = document.getElementById('amountSent');
const amountDeductedInput = document.getElementById('amountDeducted');
const transferFeeElement = document.getElementById('transferFee');
const feePercentageElement = document.getElementById('feePercentage');

// Constants for limits
const FEE_PER_1000 = 1; // $1 fee for every $1000

// Track which input was last changed to prevent infinite loops
let lastChanged = null;

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Format percentage
function formatPercentage(value) {
    return value.toFixed(2) + '%';
}

// Validate and clamp value within limits
function validateAndClamp(value, min, max) {
    if (isNaN(value) || value === '') return null;
    return Math.max(min, Math.min(max, parseFloat(value)));
}

// Calculate fee based on amount sent
// Fee is $1 for every $1000 sent, rounded to 2 decimal places
function calculateFee(amountSent) {
    if (amountSent <= 0) return null;
    
    // Calculate fee as $1 for every $1000
    let fee = (amountSent / 1000) * FEE_PER_1000;
    
    // Always round up to 2 decimal places
    fee = Math.ceil(fee * 100) / 100;
    
    // Ensure minimum fee of $0.50 for amounts under $1000
    if (amountSent > 0 && amountSent < 1000) {
        fee = 0.5;
    }
    
    return fee;
}

// Calculate amount deducted from amount sent
function calculateAmountDeducted(amountSent) {
    if (amountSent <= 0) return null;
    
    const fee = calculateFee(amountSent);
    if (fee === null) return null;
    
    return amountSent + fee;
}

// Calculate amount sent from amount deducted
function calculateAmountSent(amountDeducted) {
    if (amountDeducted <= 0) return null;
    
    // We need to solve: amountDeducted = amountSent + fee
    // where fee = $1 for every $1000 in amountSent
    
    // For amounts under $1000, fee is $0.50
    if (amountDeducted <= 1000.5) {
        return amountDeducted - 0.5;
    }
    
    // For amounts $1000 and above, we need to find the right amountSent
    // where amountDeducted = amountSent + floor(amountSent/1000)
    // This is complex, so we'll use iteration
    let amountSent = amountDeducted;
    let iterations = 0;
    const maxIterations = 10;
    
    while (iterations < maxIterations) {
        const fee = calculateFee(amountSent);
        const calculatedDeducted = amountSent + fee;
        
        if (Math.abs(calculatedDeducted - amountDeducted) < 0.01) {
            return amountSent;
        }
        
        // Adjust amountSent based on the difference
        const difference = amountDeducted - calculatedDeducted;
        amountSent += difference;
        iterations++;
    }
    
    return amountSent;
}

// Update the display values
function updateDisplay(amountSent, amountDeducted) {
    if (amountSent !== null && amountDeducted !== null) {
        const transferFee = amountDeducted - amountSent;
        const feePercentage = (transferFee / amountDeducted) * 100;
        
        transferFeeElement.textContent = formatCurrency(transferFee);
        feePercentageElement.textContent = formatPercentage(feePercentage);
    } else {
        transferFeeElement.textContent = '$0.00';
        feePercentageElement.textContent = '0.00%';
    }
}

// Handle amount sent input change
function handleAmountSentChange() {
    if (lastChanged === 'amountSent') return;
    
    lastChanged = 'amountSent';
    const amountSent = parseFloat(amountSentInput.value);
    
    if (!isNaN(amountSent) && amountSent > 0) {
        const amountDeducted = calculateAmountDeducted(amountSent);
        if (amountDeducted !== null) {
            amountDeductedInput.value = amountDeducted.toFixed(2);
            updateDisplay(amountSent, amountDeducted);
        } else {
            amountDeductedInput.value = '';
            updateDisplay(amountSent, null);
        }
    } else {
        amountDeductedInput.value = '';
        updateDisplay(null, null);
    }
    
    lastChanged = null;
}

// Handle amount deducted input change
function handleAmountDeductedChange() {
    if (lastChanged === 'amountDeducted') return;
    
    lastChanged = 'amountDeducted';
    const amountDeducted = parseFloat(amountDeductedInput.value);
    
    if (!isNaN(amountDeducted) && amountDeducted > 0) {
        const amountSent = calculateAmountSent(amountDeducted);
        if (amountSent !== null && amountSent > 0) {
            amountSentInput.value = amountSent.toFixed(2);
            updateDisplay(amountSent, amountDeducted);
        } else {
            amountSentInput.value = '';
            updateDisplay(null, amountDeducted);
        }
    } else {
        amountSentInput.value = '';
        updateDisplay(null, null);
    }
    
    lastChanged = null;
}

// Add input validation styling
function addValidationStyling(input, isValid) {
    if (isValid) {
        input.style.borderColor = '#e1e5e9';
        input.style.background = '#f8f9fa';
    } else {
        input.style.borderColor = '#e74c3c';
        input.style.background = '#fdf2f2';
    }
}

// Validate amount sent input
function validateAmountSent() {
    const value = parseFloat(amountSentInput.value);
    const isValid = isNaN(value) || value > 0;
    addValidationStyling(amountSentInput, isValid);
}

// Validate amount deducted input
function validateAmountDeducted() {
    const value = parseFloat(amountDeductedInput.value);
    const isValid = isNaN(value) || value > 0;
    addValidationStyling(amountDeductedInput, isValid);
}

// Event listeners
amountSentInput.addEventListener('input', handleAmountSentChange);
amountSentInput.addEventListener('blur', validateAmountSent);

amountDeductedInput.addEventListener('input', handleAmountDeductedChange);
amountDeductedInput.addEventListener('blur', validateAmountDeducted);

// Initialize display
updateDisplay(null, null);

// Add some example values on page load
window.addEventListener('load', () => {
    // Set a default example
    amountSentInput.value = '1000.00';
    handleAmountSentChange();
});
