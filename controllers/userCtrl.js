const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registration() {
    /*await fetch('http://localhost:3000/users')
    .then(res => res.json())
    .then(data => console.log(data))*/

    let nameField = document.querySelector('#nameField')
    let emailField = document.querySelector('#emailField')
    let passwdField = document.querySelector('#passwdField')
    let confirmPasswdField = document.querySelector('#confirmpasswdField')

    if (nameField.value == "" || emailField.value == "" || passwdField.value == "" || confirmPasswdField.value == "") {
        Alerts("Nem adtál meg minden adatot!", 'danger')
        return;
    }

    if (passwdField.value != confirmPasswdField.value) {
        Alerts("A megadott jelszavak nem egyeznek!", 'danger')
        return;
    }

    if (!passwdRegExp.test(passwdField.value)) {
        Alerts("A megadott jelszó nem elég biztonságos!", 'danger')
        return;
    }
    if (!emailRegExp.test(emailField.value)) {
        Alerts("Nem megfelelő email cím!", 'danger')
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body:
                JSON.stringify(
                    {
                        name: nameField.value,
                        email: emailField.value,
                        password: passwdField.value
                    }
                )
        });
        let alertStatus = res.status == 200 ? 'success' : 'danger';
        const data = await res.json();
        Alerts(`${data.msg}`, alertStatus);
        if (res.status == 200) {
            nameField.value = "";
            emailField.value = "";
            passwdField.value = "";
            confirmPasswdField.value = "";
        }

    } catch (err) {
        console.log("Hiba történt: ", err);
    }


}

async function login() {
    let emailField = document.querySelector('#emailField')
    let passwdField = document.querySelector('#passwdField')

    if (emailField.value == "" || passwdField.value == "") {
        Alerts("Nem adtál meg minden adatot!", 'danger')
        return;
    }

    let user = {};
    try {
        const res = await fetch(`${ServerURL}/users/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body:
                JSON.stringify(
                    {
                        email: emailField.value,
                        password: passwdField.value
                    }
                )

        });
        user = await res.json();

        if (user.id) {
            loggedUser = user;
        }

        if (!loggedUser) {
            Alerts("Hibás belépési adatok!", 'danger')
            return;
        }

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        await render('main')
        getLoggedUser();
        Alerts("Sikeres bejelentkezés!", 'success')

    } catch (err) {
        console.log("Hiba történt: ", err);
    }
}

function logout() {
    sessionStorage.removeItem('loggedUser');
    getLoggedUser();
    render('login');
}

function getProfile() {
    let emailField = document.querySelector('#emailField');
    let nameField = document.querySelector('#nameField');
    let currentUser = JSON.parse(sessionStorage.getItem('loggedUser'));

    emailField.value = currentUser.email;
    nameField.value = currentUser.name;
}

async function updateProfile() {
    let emailField = document.querySelector('#emailField');
    let nameField = document.querySelector('#nameField');

    if (nameField.value == "" || emailField.value == "") {
        Alerts("Nem adtál meg minden adatot! (Adatmódosítás)", 'danger')
        return;
    }

    if (!emailRegExp.test(emailField.value)) {
        Alerts("Nem megfelelő email cím!", 'danger')
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users/profile`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    id: loggedUser.id,
                    name: nameField.value,
                    email: emailField.value
                }
            )
        });

        let alertStatus = res.status == 200 ? 'success' : 'danger';

        const data = await res.json();

        if (res.status == 200) {
            sessionStorage.setItem('loggedUser', JSON.stringify({ id: loggedUser.id, name: nameField.value, email: emailField.value, password: loggedUser.password }));
        }
        Alerts(`${data.msg}`, alertStatus);

    } catch (error) {
        Alerts(`Hiba történt a módosítás során! ${error} `, 'danger')
    }

}

async function updatePassword() {
    let oldPasswdField = document.querySelector('#oldPasswdField');
    let newPasswdField = document.querySelector('#newPasswdField');
    let newPasswdFieldAgain = document.querySelector('#newPasswdFieldAgain');

    loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

    if (oldPasswdField.value == "" || newPasswdField.value == "" || newPasswdFieldAgain.value == "") {
        Alerts("Nem adtál meg minden adatot! (Jelszómódosítás)", 'danger')
        return;
    }
    if (oldPasswdField.value != loggedUser.password) {
        Alerts("Hibás régi jelszó!", 'danger')
        return;
    }
    if (newPasswdField.value != newPasswdFieldAgain.value) {
        Alerts("A megadott új jelszavak nem egyeznek!", 'danger')
        return;
    }
    if (!passwdRegExp.test(newPasswdField.value)) {
        Alerts("Az új jelszó nem elég biztonságos!", 'danger')
        return;
    }
    if (oldPasswdField.value == newPasswdField.value) {
        Alerts("A régi jelszó nem egyezhet az újjal!", 'danger')
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users/passmod`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    id: loggedUser.id,
                    newPassword: newPasswdField.value
                }
            )
        });
        let alertStatus = res.status == 200 ? 'success' : 'danger';
        const data = await res.json();
        if (res.status == 200) {
            sessionStorage.setItem('loggedUser', JSON.stringify({ id: loggedUser.id, name: loggedUser.name, email: loggedUser.email, password: newPasswdField.value}));
        }

        Alerts(`${data.msg}`, alertStatus);

    } catch (error) {
        Alerts(`Hiba történt a jelszómódosítás során! ${error} `, 'danger')
    }


}