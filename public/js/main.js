var body = document.getElementById('a');
body.addEventListener('click', editItem);

async function saveToStorage(e) {
    e.preventDefault();
    const amount = event.target.amount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    //const userid = ;


    const obj = {
        amount: amount,
        description: description,
        category: category
    }
    const token = localStorage.getItem('token')
    let res = await axios.post(`../expense/add-expense`, obj, { headers: { "Authorization": token } });
    showNewExpenseOnScreen(res.data.newExpenseDetails)
}
window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token')
    let res = await axios.get(`../expense/get-expenses`, { headers: { "Authorization": token } });

    for (var i = 0; i < res.data.allExpenses.length; i++) {
        showNewExpenseOnScreen(res.data.allExpenses[i])
    }

})

//show details on screen
function showNewExpenseOnScreen(obj, ID = '1qazx234rfvrrf') {
    if (obj['id']) {
        ID = obj['id']
    }
    var newText = document.createTextNode(obj['description'] + ' ' + obj['category'] + ' ' + obj['amount'] + ' ');

    // Add text to div
    var a = document.querySelector('#a');
    var b = document.querySelector('#b');

    var div0 = document.createElement('div');
    div0.className = "card col-4 bg-primary-subtle";
    var div = document.createElement('div');
    div.className = "card-body";

    div.id = ID;
    div.appendChild(newText);

    //delete btn
    var deleteBtn = document.createElement('button');

    deleteBtn.className = 'btn btn-sm btn-danger float-right delete';

    deleteBtn.appendChild(document.createTextNode('X'));

    div.appendChild(deleteBtn);

    div0.appendChild(div);

    a.insertBefore(div0, b);
}
// Remove item
function editItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are You Sure?')) {
            var div = e.target.parentElement.parentElement;
            body.removeChild(div);
            var id = e.target.parentElement.id;
            axios.delete(`../expense/delete-expense/${id}`);
        }
    }
    else if (e.target.classList.contains('premium')) {
        console.log('hi');
    }

}
