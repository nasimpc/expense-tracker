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
    const currentuser = await axios.get(`../user/currentuser`, { headers: { "Authorization": token } });
    const { name, email, ispremiumuser } = currentuser.data.user;
    if (ispremiumuser == 1) {
        document.getElementById('logoName').innerHTML = "Expense Tracker Pro";
        document.getElementById('rzp-button1').remove();
        document.getElementById('rzp-button2').className = "btn float-end premium btn-success";
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
                document.getElementById('rzp-button2').className = "btn float-end premium btn-success";

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