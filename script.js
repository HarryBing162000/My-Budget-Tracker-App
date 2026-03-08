// ========================================
// BUDGET TRACKER - JAVASCRIPT
// ========================================

// ========================================
// CUSTOM ALERT SYSTEM
// ========================================

const alertBackdrop = document.getElementById('customAlertBackdrop');
const alertModal = document.getElementById('customAlertModal');
const alertTitle = document.getElementById('alertTitle');
const alertMessage = document.getElementById('alertMessage');
const alertIcon = document.getElementById('alertIcon');
const alertOkBtn = document.getElementById('alertOkBtn');
const alertCancelBtn = document.getElementById('alertCancelBtn');

let alertResolve = null;

// ========================================
// EDIT MODAL SYSTEM
// ========================================

const editBackdrop = document.getElementById('editBackdrop');
const editModal = document.getElementById('editModal');
const editExpenseName = document.getElementById('editExpenseName');
const editExpenseAmount = document.getElementById('editExpenseAmount');
const editExpenseDate = document.getElementById('editExpenseDate');
const editSaveBtn = document.getElementById('editSaveBtn');
const editCancelBtn = document.getElementById('editCancelBtn');

let currentEditingIndex = null;

/**
 * FUNCTION: showAlert(message, title, type)
 * PURPOSE: Display a custom styled alert instead of browser alert()
 * 
 * Parameters:
 * - message: The main message to display
 * - title: The title of the alert (default: "Alert")
 * - type: "success", "error", "warning", "info" (changes icon and colors)
 */
function showAlert(message, title = 'Alert', type = 'info') {
    // Remove any previous alert type classes
    alertModal.className = 'alert-modal ' + type;
    
    // Set the content
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    
    // Set icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    alertIcon.textContent = icons[type] || '✓';
    
    // Hide cancel button for single-button alerts
    alertCancelBtn.style.display = 'none';
    alertOkBtn.style.width = '100%';
    
    // Show the alert
    alertBackdrop.classList.add('show');
    
    // Return a promise (so code can wait for user response)
    return new Promise((resolve) => {
        alertResolve = resolve;
    });
}

/**
 * FUNCTION: showConfirm(message, title)
 * PURPOSE: Show an alert with OK and Cancel buttons
 * 
 * Returns a promise that resolves to true (OK) or false (Cancel)
 */
function showConfirm(message, title = 'Confirm') {
    alertModal.className = 'alert-modal warning';
    
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    alertIcon.textContent = '❓';
    
    // Show both buttons
    alertCancelBtn.style.display = 'block';
    alertOkBtn.style.width = 'auto';
    
    // Show the alert
    alertBackdrop.classList.add('show');
    
    return new Promise((resolve) => {
        alertResolve = resolve;
    });
}

/**
 * Hide the alert modal when OK is clicked
 */
alertOkBtn.addEventListener('click', function() {
    alertBackdrop.classList.remove('show');
    if (alertResolve) {
        alertResolve(true);
    }
});

/**
 * Hide the alert modal when Cancel is clicked
 */
alertCancelBtn.addEventListener('click', function() {
    alertBackdrop.classList.remove('show');
    if (alertResolve) {
        alertResolve(false);
    }
});

/**
 * Close alert when clicking outside of it (on the backdrop)
 */
alertBackdrop.addEventListener('click', function(e) {
    if (e.target === alertBackdrop) {
        alertBackdrop.classList.remove('show');
        if (alertResolve) {
            alertResolve(false);
        }
    }
});

// ========================================
// EDIT MODAL EVENT LISTENERS
// ========================================

/**
 * Save edited expense
 */
editSaveBtn.addEventListener('click', async function() {
    const name = editExpenseName.value.trim();
    const amount = parseFloat(editExpenseAmount.value);
    const date = editExpenseDate.value;

    // Validate inputs
    if (name === '') {
        await showAlert('Please enter an expense name', 'Missing Name', 'error');
        return;
    }

    if (isNaN(amount) || amount < 0) {
        await showAlert('Please enter a valid amount', 'Invalid Amount', 'error');
        return;
    }

    if (date === '') {
        await showAlert('Please select a date', 'Missing Date', 'error');
        return;
    }

    // Update the expense in the array
    currentBudgetData.expenses[currentEditingIndex] = {
        name: name,
        amount: amount,
        date: date
    };

    // Close the modal
    editBackdrop.classList.remove('show');

    // Save to localStorage
    saveBudgetData(currentPeriodKey, currentBudgetData);

    // Update displays
    renderExpensesList();
    updateDashboard();

    await showAlert(`Expense updated: ${name} (${formatCurrency(amount)})`, 'Updated!', 'success');
});

/**
 * Cancel editing
 */
editCancelBtn.addEventListener('click', function() {
    editBackdrop.classList.remove('show');
});

/**
 * Close edit modal when clicking outside
 */
editBackdrop.addEventListener('click', function(e) {
    if (e.target === editBackdrop) {
        editBackdrop.classList.remove('show');
    }
});

// Step 1: Get references to HTML elements
// This is like saying: "Find these elements for me so I can use them later"
const netPayInput = document.getElementById('netPayInput');
const netPayBtn = document.getElementById('setNetPayBtn');
const expenseNameInput = document.getElementById('expenseNameInput');
const expenseAmountInput = document.getElementById('expenseAmountInput');
const expenseDateInput = document.getElementById('expenseDateInput');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expensesList = document.getElementById('expensesList');
const newBudgetBtn = document.getElementById('newBudgetBtn');
const savingsInput = document.getElementById('savingsInput');
const setSavingsBtn = document.getElementById('setSavingsBtn');
const sortExpensesBtn = document.getElementById('sortExpensesBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');

// Display elements (these show the totals)
const netPayDisplay = document.getElementById('netPayDisplay');
const totalExpensesDisplay = document.getElementById('totalExpensesDisplay');
const remainingBalanceDisplay = document.getElementById('remainingBalanceDisplay');
const savingsDisplay = document.getElementById('savingsDisplay');
const currentPayPeriodDisplay = document.getElementById('currentPayPeriod');
const daysRemainingDisplay = document.getElementById('daysRemaining');

// Sort state
let isSortNewest = true; // true = newest first, false = oldest first

// Load More state
let expensesPerPage = 10; // Show 10 expenses per page
let currentDisplayCount = expensesPerPage; // How many expenses are currently displayed

// ========================================
// STEP 2: HELPER FUNCTIONS
// ========================================

/**
 * FUNCTION: getPayPeriod()
 * PURPOSE: Figure out which pay period we're in (14th-28th or 29th-13th)
 * 
 * How it works:
 * - Get today's day number (1-31)
 * - If day is between 14 and 28: we're in the "14th pay period"
 * - If day is between 29 and 31 OR 1 and 13: we're in the "29th pay period"
 * 
 * RETURNS: Object with { startDate, endDate, periodKey }
 */
function getPayPeriod() {
    const today = new Date();
    const currentDay = today.getDate(); // Gets day: 1-31
    const currentMonth = today.getMonth(); // Gets month: 0-11
    const currentYear = today.getFullYear(); // Gets year: 2026

    let startDate, endDate, periodKey;

    // Is it the 14th - 28th period?
    if (currentDay >= 14 && currentDay <= 28) {
        // Start: 14th of this month
        startDate = new Date(currentYear, currentMonth, 14);
        // End: 28th of this month
        endDate = new Date(currentYear, currentMonth, 28);
        // Use this key to store data in localStorage
        periodKey = `${currentYear}-${currentMonth}-14`;
    } 
    // Otherwise it's the 29th - 13th period
    else {
        if (currentDay <= 13) {
            // We're in the 29th period of LAST month
            startDate = new Date(currentYear, currentMonth - 1, 29);
            endDate = new Date(currentYear, currentMonth, 13);
            periodKey = `${currentYear}-${currentMonth - 1}-29`;
        } else {
            // We're in the 29th period of THIS month
            startDate = new Date(currentYear, currentMonth, 29);
            // End will be next month 13th
            endDate = new Date(currentYear, currentMonth + 1, 13);
            periodKey = `${currentYear}-${currentMonth}-29`;
        }
    }

    return { startDate, endDate, periodKey };
}

/**
 * FUNCTION: calculateDaysRemaining()
 * PURPOSE: Figure out how many days are left in this pay period
 */
function calculateDaysRemaining() {
    const { endDate } = getPayPeriod();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    endDate.setHours(0, 0, 0, 0);

    // Calculate the difference in days
    const timeDifference = endDate - today;
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysRemaining;
}

/**
 * FUNCTION: getTodayDateString()
 * PURPOSE: Get today's date in YYYY-MM-DD format for the date input
 */
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * FUNCTION: formatDate(date)
 * PURPOSE: Convert a date object to a readable string like "Mar 14"
 */
function formatDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * FUNCTION: formatDateDisplay(dateString)
 * PURPOSE: Convert a date string to a readable format like "Mar 14, 2026"
 */
function formatDateDisplay(dateString) {
    if (!dateString) return 'No date';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
}

/**
 * FUNCTION: formatCurrency(number)
 * PURPOSE: Convert a number to currency format like "₱1,234.56"
 */
function formatCurrency(number) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

// ========================================
// STEP 3: LOCALSTORAGE FUNCTIONS
// localStorage is like a "sticky note" that remembers data even after you close the browser
// ========================================

/**
 * FUNCTION: loadBudgetData(periodKey)
 * PURPOSE: Get data from localStorage for a specific pay period
 * 
 * localStorage structure:
 * {
 *   "budget-2026-0-14": {
 *     "netPay": 3000,
 *     "savings": 500,
 *     "expenses": [
 *       { "name": "Groceries", "amount": 150 },
 *       { "name": "Gas", "amount": 50 }
 *     ]
 *   }
 * }
 */
function loadBudgetData(periodKey) {
    // Try to get data from localStorage using the key
    const savedData = localStorage.getItem(`budget-${periodKey}`);

    if (savedData) {
        // If data exists, parse it (convert text back to object)
        return JSON.parse(savedData);
    } else {
        // If no data exists, create an empty budget
        return {
            netPay: 0,
            savings: 0,
            expenses: []
        };
    }
}

/**
 * FUNCTION: saveBudgetData(periodKey, budgetData)
 * PURPOSE: Save data to localStorage for a specific pay period
 */
function saveBudgetData(periodKey, budgetData) {
    // Convert object to text and save it
    localStorage.setItem(`budget-${periodKey}`, JSON.stringify(budgetData));
}

/**
 * FUNCTION: getAllBudgets()
 * PURPOSE: Get a list of all saved budgets (for the New Budget button)
 */
function getAllBudgets() {
    const budgets = [];
    
    // Loop through all items in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Only get items that are budgets (start with "budget-")
        if (key.startsWith('budget-')) {
            const data = JSON.parse(localStorage.getItem(key));
            budgets.push({
                key: key,
                data: data
            });
        }
    }
    
    return budgets;
}

// ========================================
// STEP 4: STATE MANAGEMENT
// This tracks what's currently loaded in the app
// ========================================

let currentBudgetData = null;
let currentPeriodKey = null;

/**
 * FUNCTION: initializeBudget()
 * PURPOSE: Load the current pay period's budget into memory
 */
function initializeBudget() {
    const { periodKey, startDate, endDate } = getPayPeriod();
    currentPeriodKey = periodKey;
    currentBudgetData = loadBudgetData(periodKey);

    // Update the display to show current pay period
    updatePayPeriodDisplay(startDate, endDate);
}

// ========================================
// STEP 5: DOM MANIPULATION FUNCTIONS
// These update what the user sees on screen
// ========================================

/**
 * FUNCTION: updatePayPeriodDisplay(startDate, endDate)
 * PURPOSE: Update the header to show "14 Mar - 28 Mar" etc
 */
function updatePayPeriodDisplay(startDate, endDate) {
    const daysRemaining = calculateDaysRemaining();
    currentPayPeriodDisplay.textContent = 
        `Pay Period: ${formatDate(startDate)} - ${formatDate(endDate)}`;
    daysRemainingDisplay.textContent = 
        `(${daysRemaining} days remaining)`;
}

/**
 * FUNCTION: getSortedExpenses()
 * PURPOSE: Return expenses sorted by date
 * 
 * - If isSortNewest = true: newest dates first (descending)
 * - If isSortNewest = false: oldest dates first (ascending)
 */
function getSortedExpenses() {
    let sorted = [...currentBudgetData.expenses]; // Create a copy
    
    sorted.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (isSortNewest) {
            // Newest first (descending)
            return dateB - dateA;
        } else {
            // Oldest first (ascending)
            return dateA - dateB;
        }
    });
    
    return sorted;
}

/**
 * FUNCTION: groupExpensesByDate(expenses)
 * PURPOSE: Group expenses by date and return as object
 * 
 * Returns: {
 *   "Mar 8, 2026": [expense1, expense2],
 *   "Mar 7, 2026": [expense3]
 * }
 */
function groupExpensesByDate(expenses) {
    const grouped = {};
    
    expenses.forEach((expense) => {
        const dateKey = formatDateDisplay(expense.date);
        
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        grouped[dateKey].push(expense);
    });
    
    return grouped;
}

/**
 * FUNCTION: updateDashboard()
 * PURPOSE: Recalculate and update all the summary numbers
 * 
 * This is a KEY function - it shows how DOM manipulation works:
 * 1. Calculate the totals from the expenses array
 * 2. Update the display elements with new values
 * 
 * Formula:
 * - Total Expenses = sum of all expenses
 * - Remaining Balance = Net Pay - Savings - Total Expenses
 * - Savings = the amount user specified
 */
function updateDashboard() {
    // Calculate total expenses
    const totalExpenses = currentBudgetData.expenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    // Get values from current budget
    const netPay = currentBudgetData.netPay;
    const savings = currentBudgetData.savings;

    // Calculate remaining balance (what's left after savings and expenses)
    const remainingBalance = netPay - savings - totalExpenses;

    // Update the DOM (display the values)
    // textContent changes what the user sees
    netPayDisplay.textContent = formatCurrency(netPay);
    totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
    remainingBalanceDisplay.textContent = formatCurrency(remainingBalance);
    savingsDisplay.textContent = formatCurrency(savings);

    // Save the updated data to localStorage
    saveBudgetData(currentPeriodKey, currentBudgetData);
}

/**
 * FUNCTION: renderExpensesList()
 * PURPOSE: Display all expenses in the HTML
 * 
 * HOW IT WORKS:
 * 1. Clear the old list (empty the container)
 * 2. If there are NO expenses, show "No expenses" message
 * 3. If there ARE expenses, create HTML for each one and add it to the page
 */
function renderExpensesList() {
    // Step 1: Clear the list
    expensesList.innerHTML = '';

    // Step 2: Check if there are any expenses
    if (currentBudgetData.expenses.length === 0) {
        // Show empty message
        expensesList.innerHTML = '<p class="empty-message">No expenses yet. Add one above!</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }

    // Get sorted expenses
    const sortedExpenses = getSortedExpenses();
    
    // Get total count of expenses
    const totalExpenses = sortedExpenses.length;
    
    // Slice to only show current display count
    const expensesToDisplay = sortedExpenses.slice(0, currentDisplayCount);
    
    // Group by date (only the expenses to display)
    const groupedExpenses = groupExpensesByDate(expensesToDisplay);
    
    // Create HTML for each group
    Object.keys(groupedExpenses).forEach((dateKey) => {
        // Create group container
        const expenseGroup = document.createElement('div');
        expenseGroup.className = 'expense-group';
        
        // Create group header with date and count
        const groupHeader = document.createElement('div');
        groupHeader.className = 'expense-group-header';
        const count = groupedExpenses[dateKey].length;
        groupHeader.innerHTML = `
            <span>${dateKey}</span>
            <span class="expense-group-count">${count} ${count === 1 ? 'expense' : 'expenses'}</span>
        `;
        expenseGroup.appendChild(groupHeader);
        
        // Create expense items for this date
        groupedExpenses[dateKey].forEach((expense, dateIndex) => {
            // Find the original index in currentBudgetData.expenses
            const originalIndex = currentBudgetData.expenses.findIndex(e => 
                e.name === expense.name && e.amount === expense.amount && e.date === expense.date
            );
            
            const expenseItem = document.createElement('div');
            expenseItem.className = 'expense-item';
            
            expenseItem.innerHTML = `
                <div class="expense-info">
                    <div class="expense-name">${expense.name}</div>
                    <div class="expense-date">${formatDateDisplay(expense.date)}</div>
                    <div class="expense-amount">${formatCurrency(expense.amount)}</div>
                </div>
                <div class="expense-actions">
                    <button class="edit-btn-small" onclick="openEditExpense(${originalIndex})">Edit</button>
                    <button class="delete-btn" onclick="deleteExpense(${originalIndex})">Delete</button>
                </div>
            `;
            
            expenseGroup.appendChild(expenseItem);
        });
        
        // Add group to list
        expensesList.appendChild(expenseGroup);
    });
    
    // Show/hide load more button
    if (currentDisplayCount < totalExpenses) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.textContent = `Load More Expenses (${totalExpenses - currentDisplayCount} remaining)`;
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// ========================================
// STEP 6: EVENT HANDLERS
// These functions run when the user clicks buttons or types
// ========================================

/**
 * EVENT: Set Net Pay
 * WHEN: User clicks the "Set Net Pay" button
 */
netPayBtn.addEventListener('click', async function() {
    const amount = parseFloat(netPayInput.value);

    // Validate the input
    if (isNaN(amount) || amount < 0) {
        await showAlert('Please enter a valid amount', 'Invalid Input', 'error');
        return;
    }

    // Update the current budget data
    currentBudgetData.netPay = amount;

    // Save to localStorage
    saveBudgetData(currentPeriodKey, currentBudgetData);

    // Update display
    updateDashboard();

    // Clear the input field
    netPayInput.value = '';

    await showAlert(`Net pay set to ${formatCurrency(amount)}`, 'Success!', 'success');
});

/**
 * EVENT: Set Savings
 * WHEN: User clicks the "Set Savings" button
 */
setSavingsBtn.addEventListener('click', async function() {
    const amount = parseFloat(savingsInput.value);

    // Validate the input
    if (isNaN(amount) || amount < 0) {
        await showAlert('Please enter a valid savings amount', 'Invalid Input', 'error');
        return;
    }

    // Check if savings is more than net pay
    if (amount > currentBudgetData.netPay) {
        await showAlert(
            `Savings (${formatCurrency(amount)}) cannot be more than Net Pay (${formatCurrency(currentBudgetData.netPay)})`,
            'Savings Too High',
            'warning'
        );
        return;
    }

    // Update the current budget data
    currentBudgetData.savings = amount;

    // Save to localStorage
    saveBudgetData(currentPeriodKey, currentBudgetData);

    // Update display
    updateDashboard();

    // Clear the input field
    savingsInput.value = '';

    await showAlert(`Savings target set to ${formatCurrency(amount)}`, 'Savings Set!', 'success');
});

/**
 * EVENT: Add Expense
 * WHEN: User clicks the "Add Expense" button
 */
addExpenseBtn.addEventListener('click', async function() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const date = expenseDateInput.value;

    // Validate inputs
    if (name === '') {
        await showAlert('Please enter an expense name', 'Missing Name', 'error');
        return;
    }

    if (isNaN(amount) || amount < 0) {
        await showAlert('Please enter a valid amount', 'Invalid Amount', 'error');
        return;
    }

    if (date === '') {
        await showAlert('Please select a date for this expense', 'Missing Date', 'error');
        return;
    }

    // Add the new expense to the array
    currentBudgetData.expenses.push({
        name: name,
        amount: amount,
        date: date
    });

    // Clear the input fields
    expenseNameInput.value = '';
    expenseAmountInput.value = '';
    expenseDateInput.value = getTodayDateString(); // Set to today's date

    // Reset display count to show first 10 expenses after adding new one
    currentDisplayCount = expensesPerPage;

    // Re-render the list and update dashboard
    renderExpensesList();
    updateDashboard();

    await showAlert(`${name} added (${formatCurrency(amount)}) on ${formatDateDisplay(date)}`, 'Expense Added', 'success');
});

/**
 * FUNCTION: openEditExpense(index)
 * PURPOSE: Open the edit modal with the expense data pre-filled
 */
function openEditExpense(index) {
    // Store which expense we're editing
    currentEditingIndex = index;
    
    // Get the expense data
    const expense = currentBudgetData.expenses[index];
    
    // Pre-fill the form with current values
    editExpenseName.value = expense.name;
    editExpenseAmount.value = expense.amount;
    editExpenseDate.value = expense.date;
    
    // Show the edit modal
    editBackdrop.classList.add('show');
}

/**
 * FUNCTION: deleteExpense(index)
 * PURPOSE: Remove an expense from the list
 * 
 * NOTE: This function is called from the HTML inline onclick
 * The "index" tells us which expense to delete
 */
function deleteExpense(index) {
    // Remove the expense at position "index" from the array
    currentBudgetData.expenses.splice(index, 1);

    // Re-render the list and update dashboard
    renderExpensesList();
    updateDashboard();

    console.log('Expense deleted');
}

/**
 * EVENT: New Budget
 * WHEN: User clicks the "New Budget" button
 */
newBudgetBtn.addEventListener('click', async function() {
    // Show a custom confirmation dialog
    const message = 
        `Current: ${formatCurrency(currentBudgetData.netPay)}\n` +
        `Savings Target: ${formatCurrency(currentBudgetData.savings)}\n` +
        `Total Expenses: ${formatCurrency(currentBudgetData.expenses.reduce((sum, e) => sum + e.amount, 0))}\n\n` +
        'This will be saved and a new budget will start.';

    const confirmed = await showConfirm(message, 'Start New Budget?');

    if (!confirmed) {
        return; // User clicked "Cancel"
    }

    // Reset the current budget
    currentBudgetData = {
        netPay: 0,
        savings: 0,
        expenses: []
    };

    // Save to localStorage
    saveBudgetData(currentPeriodKey, currentBudgetData);

    // Reset display count for new budget
    currentDisplayCount = expensesPerPage;

    // Update displays
    renderExpensesList();
    updateDashboard();

    await showAlert('New budget started! Previous data saved.', 'Budget Reset', 'success');
});

/**
 * EVENT: Sort Expenses
 * WHEN: User clicks the sort button
 */
sortExpensesBtn.addEventListener('click', function() {
    // Toggle sort direction
    isSortNewest = !isSortNewest;
    
    // Update button text
    const sortText = isSortNewest ? '📅 Sort by Date (Newest)' : '📅 Sort by Date (Oldest)';
    sortExpensesBtn.textContent = sortText;
    
    // Reset display count when sorting changes
    currentDisplayCount = expensesPerPage;
    
    // Re-render the list with new sort order
    renderExpensesList();
});

/**
 * EVENT: Load More Expenses
 * WHEN: User clicks the load more button
 */
loadMoreBtn.addEventListener('click', function() {
    // Add 10 more expenses to the display count
    currentDisplayCount += expensesPerPage;
    
    // Re-render the list with more expenses shown
    renderExpensesList();
});

// ========================================
// STEP 7: INITIALIZATION
// This runs when the page first loads
// ========================================

/**
 * When the page loads, we need to:
 * 1. Initialize the budget (load from localStorage)
 * 2. Render the expenses list
 * 3. Update the dashboard display
 */
window.addEventListener('DOMContentLoaded', function() {
    initializeBudget();
    renderExpensesList();
    updateDashboard();
    
    // Set today's date as default in the expense date input
    expenseDateInput.value = getTodayDateString();
    
    console.log('Budget Tracker loaded successfully!');
});

// ========================================
// OPTIONAL: Development Helper
// ========================================

/**
 * Uncomment this to see all saved budgets in the console
 * Helpful for debugging!
 */
// console.log('All budgets:', getAllBudgets());
