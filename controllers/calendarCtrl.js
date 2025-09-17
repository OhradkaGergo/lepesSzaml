let calEvents = [];

function initCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: 'dayGridMonth',
        locale: 'hu',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: calEvents
    });

    calendar.render();
}

async function getCalendarData() {
    try {
        let res = await fetch(`${ServerURL}/steps/user/${loggedUser.id}`)
        steps = await res.json();

        steps.forEach(step => {
            calEvents.push({
                title : 'Lépés' + step.stepcount,
                start : step.date
            });
        }
        )
    } catch (err) {
        console.log(err);
        Alerts("Hiba az adatok lekérése során!", 'danger');
    }
}   