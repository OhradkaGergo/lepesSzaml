let chart = null;
let chartLabels = [];
let chartData = [];

async function getChartData() {
    //lekérdezi a backendtől a user lépésadatait
    //majd feltölti a labels[] és data[] tömböket
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
            }
        },       
    });
}