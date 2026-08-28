/* -------------------------------------------------------------
 * Exception Management Dashboard Logic
 * Company: GreyAtom Logistics Pvt. Ltd.
 * ------------------------------------------------------------- */

// In-Memory Data Store (Includes pre-populated items for demonstration)
let exceptions = [
  {
    id: "ex-1",
    deliveryId: "DEL-10492",
    customerName: "Alice Johnson",
    issueType: "Address Not Found",
    priority: "High",
    status: "Open",
    notes: "Gate code #2930 not working. Left package at depot for security validation."
  },
  {
    id: "ex-2",
    deliveryId: "DEL-30291",
    customerName: "Robert Chen",
    issueType: "Package Damaged",
    priority: "Medium",
    status: "Open",
    notes: "Outer packaging ripped. Inner contents exposed but apparently intact. Retrying after verification."
  },
  {
    id: "ex-3",
    deliveryId: "DEL-77821",
    customerName: "Emily Davis",
    issueType: "Payment Issue",
    priority: "Low",
    status: "Resolved",
    notes: "COD amount mismatch. Verified with operations desk and customer paid alternate link."
  }
];

// Priority weight helper for sorting
const priorityWeights = {
  "High": 3,
  "Medium": 2,
  "Low": 1
};

// Sorting State
let currentSortField = null;
let currentSortDirection = "asc"; // 'asc' or 'desc'

// Initialize Application
document.addEventListener("DOMContentLoaded", function () {
  displayCurrentDate();
  renderDashboard();
  setupEventListeners();
});

// Display Current Date in Header
function displayCurrentDate() {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-US", options);
  }
}

// -------------------------------------------------------------
// Core UI Rendering
// -------------------------------------------------------------

function renderDashboard() {
  const tableBody = document.getElementById("table-body");
  const emptyState = document.getElementById("empty-state");
  const tableElement = document.getElementById("exceptions-table");

  // Get filter inputs
  const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
  const issueFilter = document.getElementById("filter-issue").value;
  const statusFilter = document.getElementById("filter-status").value;

  // 1. Filter Data
  let filteredData = exceptions.filter(item => {
    // Search filter
    const matchesSearch = item.deliveryId.toLowerCase().includes(searchQuery) || 
                          item.customerName.toLowerCase().includes(searchQuery);
    
    // Category filter
    const matchesIssue = (issueFilter === "All") || (item.issueType === issueFilter);
    
    // Status filter
    const matchesStatus = (statusFilter === "All") || (item.status === statusFilter);

    return matchesSearch && matchesIssue && matchesStatus;
  });

  // 2. Sort Data
  if (currentSortField) {
    filteredData.sort((a, b) => {
      let valA, valB;

      if (currentSortField === "priority") {
        valA = priorityWeights[a.priority];
        valB = priorityWeights[b.priority];
      } else if (currentSortField === "status") {
        valA = a.status;
        valB = b.status;
      }

      if (valA < valB) return currentSortDirection === "asc" ? -1 : 1;
      if (valA > valB) return currentSortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // 3. Clear Table
  tableBody.innerHTML = "";

  // 4. Handle Empty State
  if (filteredData.length === 0) {
    tableElement.classList.add("hidden");
    emptyState.classList.remove("hidden");
  } else {
    tableElement.classList.remove("hidden");
    emptyState.classList.add("hidden");

    // 5. Populate Rows dynamically using strict DOM methods
    filteredData.forEach(item => {
      const row = document.createElement("tr");
      row.dataset.id = item.id;

      // Add High Priority styling accent
      if (item.priority === "High" && item.status === "Open") {
        row.classList.add("row-high-priority");
      }
      if (item.status === "Resolved") {
        row.classList.add("row-resolved");
      }

      // Delivery ID Cell
      const cellDelId = document.createElement("td");
      cellDelId.style.fontWeight = "700";
      cellDelId.style.color = "var(--dark-text)";
      cellDelId.textContent = item.deliveryId;
      row.appendChild(cellDelId);

      // Customer Name Cell
      const cellName = document.createElement("td");
      cellName.textContent = item.customerName;
      row.appendChild(cellName);

      // Issue Type Cell
      const cellIssue = document.createElement("td");
      cellIssue.textContent = item.issueType;
      row.appendChild(cellIssue);

      // Priority Level Cell with Badge
      const cellPrio = document.createElement("td");
      const prioBadge = document.createElement("span");
      prioBadge.className = `badge badge-${item.priority.toLowerCase()}`;
      prioBadge.textContent = item.priority;
      cellPrio.appendChild(prioBadge);
      row.appendChild(cellPrio);

      // Status Cell with Badge
      const cellStatus = document.createElement("td");
      const statusBadge = document.createElement("span");
      statusBadge.className = `badge badge-status-${item.status.toLowerCase()}`;
      statusBadge.textContent = item.status;
      cellStatus.appendChild(statusBadge);
      row.appendChild(cellStatus);

      // Actions Cell
      const cellActions = document.createElement("td");
      const actionsWrapper = document.createElement("div");
      actionsWrapper.className = "actions-cell";

      // Action: Resolve Button
      const btnResolve = document.createElement("button");
      btnResolve.type = "button";
      btnResolve.className = "btn-action btn-resolve";
      btnResolve.title = "Mark as Resolved";
      btnResolve.dataset.action = "resolve";
      
      // Inline SVG for Resolve
      btnResolve.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      if (item.status === "Resolved") {
        btnResolve.disabled = true;
      }
      actionsWrapper.appendChild(btnResolve);

      // Action: Delete Button
      const btnDelete = document.createElement("button");
      btnDelete.type = "button";
      btnDelete.className = "btn-action btn-delete";
      btnDelete.title = "Delete Exception Record";
      btnDelete.dataset.action = "delete";

      // Inline SVG for Delete
      btnDelete.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      `;
      actionsWrapper.appendChild(btnDelete);

      cellActions.appendChild(actionsWrapper);
      row.appendChild(cellActions);

      tableBody.appendChild(row);
    });
  }

  // Update stats counters
  updateStatistics();
}

// Update statistics dynamically with smooth count updates
function updateStatistics() {
  const totalIssues = exceptions.length;
  const openIssues = exceptions.filter(item => item.status === "Open").length;
  const resolvedIssues = exceptions.filter(item => item.status === "Resolved").length;
  const highPriorityIssues = exceptions.filter(item => item.priority === "High" && item.status === "Open").length;

  animateStatChange("stat-total", totalIssues);
  animateStatChange("stat-open", openIssues);
  animateStatChange("stat-resolved", resolvedIssues);
  animateStatChange("stat-high", highPriorityIssues);
}

// Add a pulse/animate effect to counter text changes
function animateStatChange(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const currentValue = parseInt(element.textContent, 10) || 0;
  if (currentValue === targetValue) return;

  // Visual trigger
  element.classList.remove("stat-pulse-class");
  void element.offsetWidth; // Reflow to restart keyframe animation
  element.classList.add("stat-pulse-class");

  element.textContent = targetValue;
}

// -------------------------------------------------------------
// Toast Notification Engine
// -------------------------------------------------------------

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Create Toast wrapper
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  // Assign appropriate icon according to type
  let iconSvg = "";
  if (type === "success") {
    iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === "danger") {
    iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  } else {
    // Info / Warning
    iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    `;
  }

  // Toast HTML content
  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-body">${message}</div>
    <button class="toast-close" aria-label="Close Notification">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  // Append Toast
  container.appendChild(toast);

  // Bind close button event
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => removeToast(toast));

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    removeToast(toast);
  }, 3200);
}

function removeToast(toast) {
  if (!toast.parentNode) return;
  
  // Apply exit animations via styling overrides
  toast.style.opacity = "0";
  toast.style.transform = "translateX(50px) scale(0.95)";
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 250);
}

// -------------------------------------------------------------
// Form Submissions & Validations
// -------------------------------------------------------------

function setupEventListeners() {
  const form = document.getElementById("exception-form");
  const searchInput = document.getElementById("search-input");
  const filterIssue = document.getElementById("filter-issue");
  const filterStatus = document.getElementById("filter-status");
  
  const sortPrioHeader = document.getElementById("sort-priority");
  const sortStatusHeader = document.getElementById("sort-status");

  // Form Submit Action
  form.addEventListener("submit", handleFormSubmit);

  // Real-time Inputs validation clearing
  const inputs = form.querySelectorAll('input[type="text"], select, input[type="radio"]');
  inputs.forEach(input => {
    if (input.type === "radio") {
      input.addEventListener("change", () => clearInputError(input));
    } else {
      input.addEventListener("input", () => clearInputError(input));
      input.addEventListener("change", () => clearInputError(input));
    }
  });

  // Table filtering events
  searchInput.addEventListener("input", renderDashboard);
  filterIssue.addEventListener("change", renderDashboard);
  filterStatus.addEventListener("change", renderDashboard);

  // Sorting handlers
  sortPrioHeader.addEventListener("click", () => toggleSorting("priority", sortPrioHeader));
  sortStatusHeader.addEventListener("click", () => toggleSorting("status", sortStatusHeader));

  // Table Actions - Event Delegation
  const tableBody = document.getElementById("table-body");
  tableBody.addEventListener("click", handleTableActions);
}

// Clear Validation Errors on Input
function clearInputError(inputElement) {
  let formGroup;
  if (inputElement.type === "radio") {
    formGroup = inputElement.closest(".form-group");
  } else {
    formGroup = inputElement.parentNode.closest(".form-group");
  }

  if (formGroup && formGroup.classList.contains("has-error")) {
    formGroup.classList.remove("has-error");
    const errorEl = formGroup.querySelector(".error-msg");
    if (errorEl) errorEl.style.display = "none";
  }
}

// Handle form validation and submission
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const deliveryIdInput = document.getElementById("delivery-id");
  const customerNameInput = document.getElementById("customer-name");
  const issueTypeInput = document.getElementById("issue-type");
  const notesInput = document.getElementById("notes");
  
  // Validate Radio Priority
  const priorityRadios = form.querySelectorAll('input[name="priority"]');
  let selectedPriority = "";
  priorityRadios.forEach(radio => {
    if (radio.checked) selectedPriority = radio.value;
  });

  let isValid = true;

  // Validation: Delivery ID
  if (!deliveryIdInput.value.trim()) {
    markInputError(deliveryIdInput, "Delivery ID is required.");
    isValid = false;
  }

  // Validation: Customer Name
  if (!customerNameInput.value.trim()) {
    markInputError(customerNameInput, "Customer name is required.");
    isValid = false;
  }

  // Validation: Issue Type
  if (!issueTypeInput.value) {
    markInputError(issueTypeInput, "Please select an issue type.");
    isValid = false;
  }

  // Validation: Priority Radio Buttons
  if (!selectedPriority) {
    // For radio inputs, pass the first radio to focus on the container
    markInputError(priorityRadios[0], "Priority level is required.");
    isValid = false;
  }

  if (!isValid) {
    showToast("Please correct the validation errors in the form.", "danger");
    return;
  }

  // Form is valid. Trigger loading spinner simulator (Apple / Stripe aesthetic transition)
  const submitBtn = document.getElementById("btn-submit");
  const spinner = document.getElementById("submit-spinner");
  const btnText = submitBtn.querySelector(".btn-text");

  submitBtn.disabled = true;
  spinner.style.display = "inline-block";
  btnText.textContent = "Submitting Exception...";

  // Simulation loading delay
  setTimeout(() => {
    const newException = {
      id: "ex-" + Date.now(),
      deliveryId: deliveryIdInput.value.trim().toUpperCase(),
      customerName: customerNameInput.value.trim(),
      issueType: issueTypeInput.value,
      priority: selectedPriority,
      status: "Open",
      notes: notesInput.value.trim() || "No operational notes provided."
    };

    // Store in array
    exceptions.push(newException);

    // Reset button states
    submitBtn.disabled = false;
    spinner.style.display = "none";
    btnText.textContent = "Submit Exception";

    // Clear form inputs
    form.reset();
    
    // Refresh table rendering
    renderDashboard();

    // Trigger toast notification
    showToast(`Exception reported successfully for ${newException.deliveryId}`, "success");

  }, 650); // Simulated network delay
}

// Mark validation error on DOM
function markInputError(inputElement, errorMessage) {
  let formGroup;
  if (inputElement.type === "radio") {
    formGroup = inputElement.closest(".form-group");
  } else {
    formGroup = inputElement.parentNode.closest(".form-group");
  }
  
  if (formGroup) {
    formGroup.classList.add("has-error");
    const errorEl = formGroup.querySelector(".error-msg");
    if (errorEl) {
      errorEl.textContent = errorMessage;
      errorEl.style.display = "block";
    }
  }
}

// -------------------------------------------------------------
// Table Action Triggers (Resolve / Delete)
// -------------------------------------------------------------

function handleTableActions(e) {
  // Find the action buttons or paths
  const button = e.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const row = button.closest("tr");
  if (!row) return;

  const exceptionId = row.dataset.id;
  const targetItemIndex = exceptions.findIndex(item => item.id === exceptionId);
  if (targetItemIndex === -1) return;

  const targetItem = exceptions[targetItemIndex];

  if (action === "resolve") {
    // Status update: resolve exception
    targetItem.status = "Resolved";
    
    // Render update
    renderDashboard();
    
    // Toast Alert
    showToast(`Exception for ${targetItem.deliveryId} resolved.`, "success");
  } 
  
  else if (action === "delete") {
    // Delete dialog confirm
    const isConfirmed = confirm(`Are you sure you want to delete the exception record for Delivery ID: ${targetItem.deliveryId}?`);
    
    if (isConfirmed) {
      // Remove from arrays
      exceptions.splice(targetItemIndex, 1);
      
      // Render update
      renderDashboard();
      
      // Toast Warning
      showToast(`Exception for ${targetItem.deliveryId} deleted.`, "info");
    }
  }
}

// -------------------------------------------------------------
// Interactive Sorting Logic
// -------------------------------------------------------------

function toggleSorting(field, headerElement) {
  const headers = document.querySelectorAll(".sortable-header");
  
  // Remove sorting arrows classes from other headers
  headers.forEach(h => {
    if (h !== headerElement) {
      h.classList.remove("sort-asc", "sort-desc");
    }
  });

  if (currentSortField === field) {
    // Flip direction
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  } else {
    // Set field and direction
    currentSortField = field;
    currentSortDirection = "asc";
  }

  // Update header arrow UI
  if (currentSortDirection === "asc") {
    headerElement.classList.remove("sort-desc");
    headerElement.classList.add("sort-asc");
  } else {
    headerElement.classList.remove("sort-asc");
    headerElement.classList.add("sort-desc");
  }

  // Re-render table sorting output
  renderDashboard();
}
