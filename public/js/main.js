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
    showNewExpenseOnScreen(res.data.newExpenseDetails);
    // new DataTable('#example');
}
window.addEventListener("DOMContentLoaded", async () => {
    //token for authentication
    const token = localStorage.getItem('token')
    //checking for pro sub
    const currentuser = await axios.get(`../user/currentuser`, { headers: { "Authorization": token } });
    const { name, email, ispremiumuser } = currentuser.data.user;
    if (ispremiumuser == 1) {
        document.getElementById('logoName').innerHTML = "Expense Tracker Pro";
        document.getElementById('rzp-button1').remove();
        document.getElementById('rzp-button2').className = "btn float-end premium btn-info";
    }
    //show expenses
    let res = await axios.get(`../expense/get-expenses`, { headers: { "Authorization": token } });

    for (var i = 0; i < res.data.allExpenses.length; i++) {
        showNewExpenseOnScreen(res.data.allExpenses[i])

    }
    new DataTable('#example', {
        lengthMenu: [
            [10, 15, 20],
            [10, 15, 20]
        ]
    });


})

//show details on screen
function showNewExpenseOnScreen(obj, ID = '1qazx234rfvrrf') {
    if (obj['id']) {
        ID = obj['id']
    }

    // var newText = document.createTextNode(obj['description'] + ' ' + obj['category'] + ' ' + obj['amount'] + ' ');

    // // Add text to div
    // 

    // var expenseTr = document.createElement('tr');
    // div0.className = "card bg-info-subtle";
    // var div = document.createElement('div');
    // div.className = "card-body";


    // div.appendChild(newText);

    // //delete btn


    // div.appendChild(deleteBtn);

    // div0.appendChild(div);

    // a.insertBefore(div0, b);
    var a = document.querySelector('#a');
    var expenseTr = document.createElement('tr');
    expenseTr.id = ID;
    var expenseTdexpense = document.createElement('td');
    expenseTdexpense.appendChild(document.createTextNode(obj['category']));
    expenseTr.appendChild(expenseTdexpense);
    var expenseTddescription = document.createElement('td');
    expenseTddescription.appendChild(document.createTextNode(obj['description']));
    expenseTr.appendChild(expenseTddescription);
    var expenseTdamount = document.createElement('td');
    expenseTdamount.appendChild(document.createTextNode(obj['amount']));
    expenseTr.appendChild(expenseTdamount);
    var expenseTddelete = document.createElement('td');
    var deleteBtn = document.createElement('button');

    deleteBtn.className = 'btn btn-sm btn-danger float-right delete';

    deleteBtn.appendChild(document.createTextNode('X'));
    expenseTddelete.appendChild(deleteBtn);

    expenseTr.appendChild(expenseTddelete);

    a.appendChild(expenseTr);
}
// Remove item
function editItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Are You Sure?')) {
            const token = localStorage.getItem('token')
            var div = e.target.parentElement.parentElement;
            body.removeChild(div);
            var id = e.target.parentElement.parentElement.id;
            console.log(id);
            axios.delete(`../expense/delete-expense/${id}`, { headers: { "Authorization": token } });
        }
    }

}

document.getElementById('rzp-button1').onclick = async function (e) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("../purchase/premiummembership", {
            headers: {
                'Authorization': token
            }
        });
        // clearFields();
        // successDiv3.classList.remove('d-none');
        // successDiv3.classList.add('d-block');
        const { key_id, orderid } = response.data;
        const { name, email } = response.data.user;
        var options = {
            "key": key_id,
            "order_id": orderid,
            "description": "expense tracker Test",
            "handler": async function (response) {
                const premiumstatus = await axios.put("../purchase/updatetransactionstatus", {
                    order_id: response.razorpay_order_id,
                    payment_id: response.razorpay_payment_id,
                    status: "successful"
                }, { headers: { 'Authorization': token } });

                document.getElementById('logoName').innerHTML = "Expense Tracker Pro";
                document.getElementById('rzp-button1').remove();
                document.getElementById('rzp-button2').className = "btn float-end premium btn-info";

                alert(premiumstatus.data.message);
                // window.location.href = "user";
            },
            "prefill": {
                "name": name,
                "email": email
            },
            "notes": {
                "address": "None"
            },
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', function (response) {
            console.log(response.error.metadata.order_id);
            axios.put("../purchase/updatetransactionstatus", {
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
                status: "faild"
            }, { headers: { 'Authorization': token } });
            alert('Something went wrong Transaction failed hi3');

        });

    } catch (error) {
        console.log(error);
    }

}
document.getElementById('rzp-button2').onclick = async function (e) {
    window.location.href = "proPage"
}
