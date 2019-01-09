$(function () {
    var monthlySalesContext = $(".monthly_sales");
    var lineChart = new Chart(monthlySalesContext, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "Fatturato mensile",
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
                lineTension: 0,
                fill: false
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                position: "top",
                text: "Fatturato mensile"
            },
            legend: {
                display: true,
                position: "bottom"
            }
        }
    });

    var sellersSalesContext = $(".sellers_sales");
    var doughnutChart = new Chart(sellersSalesContext, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
            labels: ["Mario", "Bruno", "Franco", "Silvia"],
            datasets: [{
                borderColor: 'rgb(255, 255, 255)',
                backgroundColor: ['#36a2eb', '#ff6384'],
                data: [30, 10, 5, 2]
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                position: "top",
                text: "Fatturato per venditore"
            },
            legend: {
                display: true,
                position: "bottom"
            }
        }
    });

    var quartersSalesContext = $(".quarters_sales");
    var barChart = new Chart(quartersSalesContext, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{
                borderColor: 'rgb(255, 255, 255)',
                backgroundColor: ['#36a2eb', '#ff6384'],
                data: [30, 10, 5, 2]
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                position: "top",
                text: "Vendite per Quarter"
            },
            legend: {
                display: false
            }
        }
    });
});

// [
//     {
//         "id": 1,
//         "salesman": "Marco",
//         "amount": 9000,
//         "date": "12/02/2017"
//     },
//     {
//         "id": 2,
//         "salesman": "Giuseppe",
//         "amount": 1000,
//         "date": "12/04/2017"
//     },
//     {
//         "id": 3,
//         "salesman": "Riccardo",
//         "amount": 1000,
//         "date": "01/04/2017"
//     },
//     {
//         "id": 4,
//         "salesman": "Riccardo",
//         "amount": 1000,
//         "date": "30/04/2017"
//     },
//     {
//         "salesman": "Riccardo",
//         "amount": 3200,
//         "date": "25/01/2017",
//         "id": 5
//     },
//     {
//         "salesman": "Riccardo",
//         "amount": 2300,
//         "date": "15/02/2017",
//         "id": 6
//     },
//     {
//         "salesman": "Riccardo",
//         "amount": 4200,
//         "date": "30/03/2017",
//         "id": 7
//     },
//     {
//         "salesman": "Riccardo",
//         "amount": 2000,
//         "date": "20/04/2017",
//         "id": 8
//     }
// ]