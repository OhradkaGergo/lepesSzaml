function setDate() {
    let today = new Date().toISOString().split('T')[0];
    let dateField = document.querySelector('#dateField')
    dateField.setAttribute('max', today);
}

async function add() {
    let stepField = document.querySelector('#stepcountField');
    let dateField = document.querySelector('#dateField');
    if (stepField.value == "" || dateField.value == "") {
        Alerts("Nem adtál meg minden adatot!", 'danger')
        return;
    }
    if (stepField.value < 0) {
        Alerts("A lépésszám nem lehet negatív!", 'danger')
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/steps/user`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:
                JSON.stringify(
                    {
                        uId: loggedUser.id,
                        stepcount: stepField.value,
                        date: dateField.value
                    })
        });
        let alertStatus = res.status == 200 ? 'success' : 'danger';
        const data = await res.json();
        Alerts(`${data.msg}`, alertStatus);
        if (res.status == 200) {
            stepField.value = "";
            dateField.value = "";
        }
    } catch (error) {
        console.log("Hiba történt: ", err);
    }
    showSteps();
}


async function showSteps() {
    try {
        let tableBody = document.querySelector('tbody');
        const res = await fetch(`${ServerURL}/steps/user/${loggedUser.id}`);
        let data = await res.json();
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement('tr');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');

            td1.textContent = data[i].id;
            td3.textContent = data[i].date;
            td4.textContent = "placeholder";

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tableBody.appendChild(tr);
        }
    } catch (error) {
        console.log("Hiba történt: ", error);
    }
}
showSteps();