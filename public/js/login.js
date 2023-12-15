async function saveToStorage(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const obj = {
        email: email,
        password: password,
    }
    try {
        const response = await axios.post(`../user/login`, obj)
        if (response.status === 200) {
            alert(response.data.message)
            console.log(response.data);
            localStorage.setItem('token', response.data.token)
            window.location.href = "mainPage"
        }

    }
    catch (err) {
        console.log(err)
        document.body.innerHTML += `<div style="color: red;">${err.response.data.message}</div>`;

    }
}
