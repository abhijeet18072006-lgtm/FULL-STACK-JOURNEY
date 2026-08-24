const expenseName = document.querySelector('input[type="text"]');
const expenseAmount = document.querySelector('input[type="number"]');
const expenseCategory = document.querySelector('select');
const expenseDate = document.querySelector('input[type="date"]');
const addButton = document.querySelector('.expense-form button');

const expenseList = document.querySelector('.expense-list');

addButton.addEventListener('click', function () {

    const name = expenseName.value;
    const amount = expenseAmount.value;
    const category = expenseCategory.value;
    const date = expenseDate.value;

    if (name === "" || amount === "" || category === "" || date === "") {
        alert("Please fill all fields!");
        return;
    }

    const expenseItem = document.createElement('div');

    expenseItem.classList.add('expense-item');

    expenseItem.innerHTML = `
        <span>${name}</span>
        <span>₹${amount}</span>
        <span>${category}</span>
        <span>${date}</span>
        <button>Delete</button>
    `;

    expenseList.appendChild(expenseItem);
    total += Number(amount);

totalAmount.textContent = `₹${total}`;

    expenseName.value = "";
    expenseAmount.value = "";
    expenseCategory.value = "";
    expenseDate.value = "";
});
expenseList.addEventListener('click', function (event) {

    if (event.target.tagName === 'BUTTON') {

        const expenseItem = event.target.parentElement;

        const amountText = expenseItem.children[1].textContent;

        const amount = Number(amountText.replace('₹', ''));

        total -= amount;

        totalAmount.textContent = `₹${total}`;

        expenseItem.remove();
    }

});
const totalAmount = document.querySelector('#totalAmount');

let total = 0;