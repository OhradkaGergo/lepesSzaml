let chart = null;
let chartLabels = [];
let chartData = [];

async function getChartData() {
    try {
        let res = await fetch(`${ServerURL}/steps/user/${loggedUser.id}`)
        steps = await res.json();
        steps = steps.sort((a, b) => new Date(a.date) - new Date(b.date));
        chartLabels = [];
        chartData = [];
        steps.forEach(step => {
            chartLabels.push(step.date);
            chartData.push(step.stepcount);
        }
        )
    } catch (err) {
        console.log(err);
        Alerts("Hiba az adatok lekérése során!", 'danger');
    }
}

function initChart() {
    // megy a hűtő? akkor menj utána
    let ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'teszt felhasználó',
                data: chartData
            }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Lépésszámok'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },       
    });
}