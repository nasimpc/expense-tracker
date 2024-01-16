
window.addEventListener("DOMContentLoaded", async () => {
    //window.location.href = "proPage"
    let res = await axios.get('../premium/leaderborddata');
    // var a = document.querySelector('#a');
    // var b = document.querySelector('#b');
    // var headingLB = document.createElement('h2');
    // headingLB.innerHTML = "Expense LeaderBoard";
    // a.insertBefore(headingLB, b);
    for (var i = 0; i < res.data.length; i++) {
        showLB(res.data[i]);

    }
    new DataTable('#example', {
        order: [[1, 'desc']],
        lengthMenu: [
            [5, 10, 15],
            [5, 10, 15]
        ]
    });

    const token = localStorage.getItem('token')
    const downloadhistory = await axios.get('../premium/downloadhistory', { headers: { "Authorization": token } });
    showDownloadhistory(downloadhistory.data);

})


function showLB(obj, ID = '1qazx234rfvrrf') {
    if (obj['id']) {
        ID = obj['id']
    }
    // var newText = document.createTextNode('name: ' + obj['name'] + ' Totel Expense: ' + obj['totalExpenses'] + ' ');

    // // Add text to div
    // var a = document.querySelector('#a');
    // var b = document.querySelector('#b');

    // var div0 = document.createElement('div');
    // div0.className = "card bg-primary-subtle ";
    // var div = document.createElement('div');
    // div.className = "card-body";

    // div.id = ID;
    // div.appendChild(newText);

    // div0.appendChild(div);

    // a.insertBefore(div0, b);
    var a = document.querySelector('#a');
    var lbtr = document.createElement('tr');
    lbtr.id = ID;
    var nametd = document.createElement('td');
    nametd.appendChild(document.createTextNode(obj['name']));
    lbtr.appendChild(nametd);
    var totalexpensetd = document.createElement('td');
    totalexpensetd.appendChild(document.createTextNode(obj['totalExpenses']));
    lbtr.appendChild(totalexpensetd);

    a.appendChild(lbtr);
}

const downloadbtn = document.querySelector('#downloadbtn');
const historyplaceholder = document.querySelector('#historyplaceholder');
downloadbtn.addEventListener('click', downloadData);

function showDownloadhistory(data) {

    if (data.length > 0) {
        historyplaceholder.innerHTML = "";
        data.forEach((ele, index) => {
            if (index < 8) {
                const date = new Date(ele.createdAt).toLocaleString();
                const x = document.createElement('a');
                x.className = "list-group-item text-nowrap";
                x.href = `${ele.downloadUrl}`
                x.innerHTML = `${date}`;
                historyplaceholder.appendChild(x);
            }

        })
    }
}
async function downloadData(e) {
    try {
        const token = localStorage.getItem('token')
        e.preventDefault();
        let response = await axios.get('../premium/download', { headers: { "Authorization": token } });
        window.location.href = response.data.URL;
        const downloadhistory = await axios.get('../premium/downloadhistory', { headers: { "Authorization": token } });
        showDownloadhistory(downloadhistory.data);
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}