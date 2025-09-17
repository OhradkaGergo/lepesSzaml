let steps = [];
let selectedStep = null;

function setDate() {
    let today = new Date().toISOString().split('T')[0];
    let date = document.querySelector('#dateField')
    date.setAttribute('max', today);
}

async function add() {


    let stepcount = document.querySelector('#stepcountField');
    let date = document.querySelector('#dateField');


    if (stepcount.value == "" || date.value == "") {
        Alerts("Nem adtál meg minden adatot!", 'danger')
        return;
    }

    let idx = steps.findIndex(step => step.date == date.value && step.uId == loggedUser.id);
    if (idx === -1) {
        try {
            let res = await fetch(`${ServerURL}/steps`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body:
                    JSON.stringify({
                        uId: loggedUser.id,
                        date: date.value,
                        stepcount: stepcount.value
                    })
            });
            let data = await res.json();
            if (res.status == 200) {
                Alerts(data.msg, 'success');
                await getSteps();
                await renderSteps();
                cancel();
            }
        } catch (err) {
            console.log(err);
            Alerts("Hiba az adatok küldése során!", 'danger');
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
                    JSON.stringify({
                        uId: loggedUser.id,
                        date: date.value,
                        stepcount: Number(steps[idx].stepcount) + Number(stepcount.value)
                    })
            });
            let data = await res.json();
            if (res.status == 200) {
                Alerts(data.msg, 'success');
                await getSteps();
                await renderSteps();
                cancel();
            }
        } catch (err) {
            console.log(err);
            Alerts("Hiba az adatok küldése során!", 'danger');
        }
    }
}

async function getSteps(){
    try {
        let res = await fetch(`${ServerURL}/steps/user/${loggedUser.id}`)
        steps = await res.json();
        steps = steps.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log(steps)
    } catch (err) {
        console.log(err)
        Alerts("Hiba az adatok küldése során!", 'danger');
    }
}

async function renderSteps() {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    let sum = 0;

    steps.forEach((step, index) => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');

        let editBtn = document.createElement('button');
        let delBtn = document.createElement('button');

        editBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2');
        delBtn.classList.add('btn', 'btn-danger', 'btn-sm');

        editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
        delBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';

        editBtn.setAttribute('onClick', `editStep(${index})`);
        delBtn.setAttribute('onClick', `deleteStep(${index})`);

        td1.innerHTML = (index+1) + '.';
        td2.innerHTML = step.date;
        td3.innerHTML = step.stepcount;
        td3.classList.add('text-end');
        td4.classList.add('text-end');

        td4.appendChild(editBtn);
        td4.appendChild(delBtn);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);

        sum += Number(step.stepcount);
    });
    let sumField = document.querySelector('#sum');
    sumField.innerHTML = sum;
}

function editStep(index) {
    let date = document.querySelector('#dateField');
    let stepcount = document.querySelector('#stepcountField');
    
    toggleMode(true);

    date.value = steps[index].date;
    stepcount.value = steps[index].stepcount;

    selectedStep = steps[index];
}

async function deleteStep(index) {
    if (confirm('Biztosan törlöd a lépésadatot?')) {
        try {
            let res = fetch(`${ServerURL}/steps/${steps[index].id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (res.status == 200) {
                Alerts(data.msg, 'success');
                await getSteps();
                cancel();
                renderSteps();
            }
            else {
                Alerts(data.msg, 'success');
            }
        } catch (err) {
            console.log(err);
            showMessage('danger', 'Hiba', 'Hiba az adatok törlése során!');
        }
    }
    
}

async function update() {
    let date = document.querySelector('#dateField');
    let stepcount = document.querySelector('#stepcountField');

    if (selectedStep.date == date.value) {
        let res = await fetch(`${ServerURL}/steps/${selectedStep.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body:
                JSON.stringify({
                    uId: loggedUser.id,
                    date: date.value,
                    stepcount: Number(stepcount.value)
                })
        });
        let data = await res.json();
        if (res.status == 200) {
            Alerts(data.msg, 'success');
            await getSteps();
            await renderSteps();
            cancel();
        }
    }
    else {
        await del();
        let idx = steps.findIndex(step => step.date == date && step.uId == loggedUser.id);
        if (idx != -1) {
            try {
                let res = await fetch(`${ServerURL}/steps`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:
                        JSON.stringify({
                            uId: loggedUser.id,
                            date: date,
                            stepcount: stepcount
                        })
                });
                let data = await res.json();
                if (res.status == 200) {
                    Alerts(data.msg, 'success');
                    await getSteps();
                    await renderSteps();
                    cancel();
                }
            } catch (err) {
                console.log(err);
                Alerts("Hiba az adatok küldése során!", 'danger');
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
                        JSON.stringify({
                            uId: loggedUser.id,
                            date: date,
                            stepcount: Number(steps[idx].stepcount) + Number(stepcount)
                        })
                });
                let data = await res.json();
                if (res.status == 200) {
                    Alerts(data.msg, 'success');
                    await getSteps();
                    await renderSteps();
                    cancel();
                }
            } catch (err) {
                console.log(err);
                Alerts("Hiba az adatok küldése során!", 'danger');
            }
        }


    }
    
}

async function del() {
    let idx = steps.findIndex(step => step.id == selectedStep.id);
    await deleteStep(selectedStep.id);
}

function cancel() {
    toggleMode(false);

    let date = document.querySelector('#dateField');
    let stepcount = document.querySelector('#stepcountField');

    date.value = null;
    stepcount.value = null;

    selectedStep = null;
}

function toggleMode(mode) {
    let addBtn = document.querySelector('#addBtn');
    let updateBtn = document.querySelector('#updateBtn');
    let delBtn = document.querySelector('#delBtn');
    let cancelBtn = document.querySelector('#cancelBtn');

    if (mode) {
        addBtn.classList.add('hide');
        updateBtn.classList.remove('hide');
        delBtn.classList.remove('hide');
        cancelBtn.classList.remove('hide');
    }
    else {
        addBtn.classList.remove('hide');
        updateBtn.classList.add('hide');
        delBtn.classList.add('hide');
        cancelBtn.classList.add('hide');
    }
}