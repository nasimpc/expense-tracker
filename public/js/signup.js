async function saveToStorage(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const obj = {
        name: name,
        email: email,
        password: password,
    }
    try {
        let res = await axios.post(`../user/add-user`, obj);
        alert(res.data.message)
        window.location.href = "mainPage"
    }
    catch (err) {
        //console.log("hi1", err);
        confirm('User already exists!');

    }
}