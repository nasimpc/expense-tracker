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
            localStorage.setItem('token', response.data.token);
            window.location.href = "mainPage"
        }

    }
    catch (err) {
        console.log(err)
        document.body.innerHTML += `<div style="color: red;">${err.response.data.message}</div>`;

    }
}


async function forgetPass(e) {
    e.preventDefault();
    const email = e.target.forgetEmail.value;
    try {
        const data = {
            email: email,
        }
        const res = await axios.post('../password/forgotpassword', data);

    }
    catch (err) {
        console.log(err)

    }

}
