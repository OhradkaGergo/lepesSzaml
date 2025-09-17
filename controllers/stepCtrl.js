let steps = [];
let selectedStep = null;

function setDate() {
    let today = new Date().toISOString().split('T')[0];
    let dateField = document.querySelector('#dateField')
    dateField.setAttribute('max', today);
}

async function add() {
    let stepcount = document.querySelector('#stepcountField').value;
    let date = document.querySelector('#dateField').value;
    if (date == "" || stepcount == "") {
        Alerts("Nem adtál meg minden adatot!", 'danger')
        return;
    }

    let idx = steps.findIndex(step => step.date == date && step.uId == loggedUser.id);
    console.log(idx);
    if (idx == -1) {
        try {
            let res = await fetch(`${ServerURL}/steps`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:
                    JSON.stringify(
                        {
                            uId: loggedUser.id,
                            date: dateField.value,
                            stepcount: stepcount
                        })
            });

            let data = await res.json();

            if (res.status == 200) {
                Alerts(`${data.msg}`, 'success')
                await getSteps();
                renderSteps();
            }
            else {
                Alerts(`${data.msg}`, 'danger')
            }

        } catch (err) {
            console.log(err);
            Alerts("Hiba történt az adatok frissítése során!", 'danger')
        }

    }
    else {
        try {
            let res = await fetch(`${ServerURL}/steps/${steps[idx].id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:
                    JSON.stringify(
                        {
                            uId: loggedUser.id,
                            date: date,
                            stepcount: Number(steps[idx].stepcount) + Number(stepcount)
                        })
            });

            let data = await res.json();

            if (res.status == 200) {
                Alerts(`${data.msg}`, 'success')
                await getSteps();
                renderSteps();
            }
            else {
                Alerts(`${data.msg}`, 'danger')
            }
        } catch (err) {
            console.log(err);
            Alerts("Hiba történt az adatok frissítése során!", 'danger')
        }
    }
}

async function getSteps() {
    try {
        let res = await fetch(`${ServerURL}/steps/user/${loggedUser.id}`);
        steps = await res.json();
        steps = steps.sort((a, b) => { return b['date'].localeCompare(a['date'])});

        console.log(steps);
    } catch (err) {
        console.log(err);
        Alerts("Hiba történt az adatok lekérdezése során!", 'danger')
    }
}

function renderSteps() {
    let tableBody = document.querySelector('tbody');
    tableBody.innerHTML = "";
    let sum = 0;

    steps.forEach((step, index) => {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');

        let editBtn = document.createElement('button');
        let delBtn = document.createElement('button');

        editBtn.classList.add('btn', 'btn-sm', 'btn-warning', 'me-2');
        delBtn.classList.add('btn', 'btn-sm', 'btn-danger');

        td1.innerHTML = (index + 1) + '.';
        td2.innerHTML = step.date;
        td3.innerHTML = step.stepcount;

        editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
        delBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';

        editBtn.setAttribute('onClick', `editStep(${index})`);
        delBtn.setAttribute('onClick', `deleteStep(${index})`);

        td4.appendChild(editBtn);
        td4.appendChild(delBtn);

        td3.classList.add('text-end');
        td4.classList.add('text-end');

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        tableBody.appendChild(tr);

        sum += Number(step.stepcount);
    });

    let sumField = document.querySelector('#sum');
    sumField.innerHTML = sum;
}

function editStep(index) {
    let stepcount = document.querySelector('#stepcountField');
    let date = document.querySelector('#dateField');

    toggleMode(true);

    date.value = steps[index].date;
    stepcount.value = steps[index].stepcount;

    selectedStep = steps[index];
}

async function update() {
    let stepcount = document.querySelector('#stepcountField');
    let date = document.querySelector('#dateField');

    if (selectedStep.date == date.value) {
        try {
            let res = await fetch(`${ServerURL}/steps/${selectedStep.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:
                    JSON.stringify(
                        {
                            uId: loggedUser.id,
                            date: date.value,
                            stepcount: Number(stepcount.value)
                        })
            });

            let data = await res.json();

            if (res.status == 200) {
                Alerts(`${data.msg}`, 'success')
                await getSteps();
                renderSteps();
            }
            else {
                Alerts(`${data.msg}`, 'danger')
            }

        } catch (err) {
            console.log(err);
            Alerts("Hiba történt az adatok frissítése során!", 'danger')
        }
    }
    else {
        let idx = steps.findIndex(step => step.date == date.value && step.uId == loggedUser.id);
        if (idx == -1) {
            try {
                let res = await fetch(`${ServerURL}/steps`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:
                        JSON.stringify(
                            {
                                uId: loggedUser.id,
                                date: dateField.value,
                                stepcount: stepcount.value
                            })
                });
    
                let data = await res.json();
    
                if (res.status == 200) {
                    Alerts(`${data.msg}`, 'success')
                    await getSteps();
                    renderSteps();
                }
                else {
                    Alerts(`${data.msg}`, 'danger')
                }

            } catch (err) {
                console.log(err);
                Alerts("Hiba történt az adatok frissítése során!", 'danger')
            }
        }
        else {
            try {
                let res = await fetch(`${ServerURL}/steps/${steps[idx].id}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:
                        JSON.stringify(
                            {
                                uId: loggedUser.id,
                                date: date.value,
                                stepcount: Number(stepcount.value)
                            })
                });
    
                let data = await res.json();
    
                if (res.status == 200) {
                    Alerts(`${data.msg}`, 'success')
                    await getSteps();
                    renderSteps();
                }
                else {
                    Alerts(`${data.msg}`, 'danger')
                }
    
            } catch (err) {
                console.log(err);
                Alerts("Hiba történt az adatok frissítése során!", 'danger')
            }
        }
    }
}

async function del() {
    let idx = steps.findIndex(step => step.id == selectedStep.id);
    await deleteStep(idx);
}

async function deleteStep(index) {
    if (confirm("Biztosan törlöd a lépésadatot?")) {
        try {
            let res = await fetch(`${ServerURL}/steps/${steps[index].id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let data = await res.json();
            if (res.status == 200) {
                Alerts(`${data.msg}`, 'success')
                await getSteps();
                cancel();
                renderSteps();
            }
            else {
                Alerts(`${data.msg}`, 'danger')
            }

        } catch (err) {
            Alerts("Hiba történt a lépésadat törlése során!", 'danger')
        }
    }
}

function cancel() {
    toggleMode(false);
    let stepcount = document.querySelector('#stepcountField');
    let date = document.querySelector('#dateField');
    date.value = null;
    stepcount.value = null;
    selectedStep = null;
}

function toggleMode(mode) {
    let addBtn = document.querySelector('#addBtn');
    let updateBtn = document.querySelector('#updateBtn');
    let delBtns = document.querySelector('#delBtn');
    let cancelBtn = document.querySelector('#cancelBtn');

    if (mode) {
        addBtn.classList.add('hide');
        updateBtn.classList.remove('hide');
        delBtns.classList.remove('hide');
        cancelBtn.classList.remove('hide');
    }
    else {
        addBtn.classList.remove('hide');
        updateBtn.classList.add('hide');
        delBtns.classList.add('hide');
        cancelBtn.classList.add('hide');
    }
}

