window.addEventListener("DOMContentLoaded", async () => {
    //window.location.href = "proPage"
    let res = await axios.get('../premium/leaderborddata');
    var a = document.querySelector('#a');
    var b = document.querySelector('#b');
    var headingLB = document.createElement('h2');
    headingLB.innerHTML = "Expense LeaderBoard";
    a.insertBefore(headingLB, b);
    for (var i = 0; i < res.data.length; i++) {
        showLB(res.data[i]);
        console.log(res.data[i]);

    }

})

function showLB(obj, ID = '1qazx234rfvrrf') {
    if (obj['id']) {
        ID = obj['id']
    }
    var newText = document.createTextNode('name: ' + obj['name'] + ' Totel Expense: ' + obj['totalExpenses'] + ' ');

    // Add text to div
    var a = document.querySelector('#a');
    var b = document.querySelector('#b');

    var div0 = document.createElement('div');
    div0.className = "card col-4 bg-primary-subtle ";
    var div = document.createElement('div');
    div.className = "card-body";

    div.id = ID;
    div.appendChild(newText);

    div0.appendChild(div);

    a.insertBefore(div0, b);
}