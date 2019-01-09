$(function () {
    moment.locale('it');
    String.prototype.capitalizeFirst = function () {
        return this.charAt(0).toUpperCase() + this.substring(1);
    };
    var monthlySalesContext = $(".monthly_sales");
    var lineChartConfigOptions = getConfigOptions(true, "Fatturato mensile", false);
    var lineChart = new Chart(monthlySalesContext, {
        type: 'line',
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
        options: lineChartConfigOptions
    });

    var sellersSalesContext = $(".sellers_sales");
    var doughnutChartConfigOptions = getConfigOptions(true, "Fatturato per venditore", true);
    var doughnutChart = new Chart(sellersSalesContext, {
        type: 'doughnut',
        data: {
            labels: ["Mario", "Bruno", "Franco", "Silvia"],
            datasets: [{
                borderColor: 'rgb(255, 255, 255)',
                backgroundColor: ['#36a2eb', '#ff6384'],
                data: [0.12, 0.28, .2, .4]
            }]
        },
        options: doughnutChartConfigOptions
    });

    var quartersSalesContext = $(".quarters_sales");
    var barChartConfigOptions = getConfigOptions(false, "Vendite per Quarter", false);
    var barChart = new Chart(quartersSalesContext, {
        type: 'bar',
        data: {
            labels: ["Q1", "Q2", "Q3", "Q4"],
            datasets: [{
                borderColor: 'rgb(255, 255, 255)',
                backgroundColor: ['#36a2eb', '#ff6384'],
                data: [30, 10, 5, 2]
            }]
        },
        options: barChartConfigOptions
    });

    let ajaxCall = new AjaxCall();
    ajaxCall.doCall(ajaxCall.getBaseUri(), ajaxCall.methodGet(), getDatasetForSellersSales);
});

function getConfigOptions(showLegend, title, percentageTooltip) {
    let configOptions = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            position: "top",
            text: title
        },
        legend: {
            display: showLegend,
            position: "bottom"
        }
    };
    //modifico il tooltip mostrando label corrent + valore in percentuale
    if (percentageTooltip) {
        configOptions.tooltip = {
            callbacks: {
                label: function (tooltipItem, data) {
                    let currentValue = data.datasets[0].data[tooltipItem.index];
                    let currentLabel = data.labels[tooltipItem.index];
                    return currentLabel + " | " + parseFloat(Math.round(currentValue * 100)).toFixed(2) + "%";
                }
            }
        };
    }
    return configOptions;
}

function AjaxCall() {
    //accesso alla variabile e alla costante tramite closure
    //pendingCall mantiene lo stato della chiamata per evitare che venga fatta una nuova chiamata quando un'altra è già in corso
    let pendingCall = false;
    const BASE_URI = "http://157.230.17.132:4007/sales";
    const METHOD_GET = "GET";
    const METHOD_POST = "POST";
    this.doCall = function (url, method, successCallback, errorCallback, data) {
        if (!pendingCall) {
            $.ajax(url, {
                method: method,
                success: (data) => {
                    //potrei non aver bisogno di questo callback pertanto controllo se è stato passato l'argomento
                    if (typeof successCallback === "function") {
                        successCallback(data);
                    }
                },
                error: () => {
                    //potrei non aver bisogno di questo callback pertanto controllo se è stato passato l'argomento
                    if (typeof errorCallback === "function") {
                        errorCallback();
                    }
                },
                data: data,
                complete: () => {
                    pendingCall = false;
                }
            });
        }
    };
    this.getBaseUri = () => BASE_URI;
    this.methodGet = () => METHOD_GET;
    this.methodPost = () => METHOD_POST;
}

function getDatasetForMonthlySales(rawData) {
    const MONTHS_IN_A_YEAR = 12;
    let dataset = {
        labels: new Array(MONTHS_IN_A_YEAR),
        data: new Array(MONTHS_IN_A_YEAR)
    };
    rawData.forEach((item) => {
        //1-base
        const MONTH_INDEX = parseInt(moment(item.date, "DD-MM-YYYY").format("M"));
        dataset.labels[MONTH_INDEX - 1] = moment(item.date, "DD-MM-YYYY").format("MMMM").capitalizeFirst();
        if (dataset.data[MONTH_INDEX - 1] === undefined) {
            dataset.data[MONTH_INDEX - 1] = 0;
        }
        dataset.data[MONTH_INDEX - 1] += item.amount;
    });
    return dataset;
}

function getDatasetForSellersSales(rawData) {
    let totalAmount = 0;
    rawData.forEach((item) => {
        totalAmount += item.amount;
    });
    let dataset = {
        labels: [],
        data: []
    };
    rawData.forEach((item) => {
        let salesmanIndex = dataset.labels.indexOf(item.salesman);
        if (salesmanIndex === -1) {
            dataset.labels.push(item.salesman);
            dataset.data.push(item.amount);
        } else {
            dataset.data[salesmanIndex] += item.amount;
        }
    });
    for (let cont = 0; cont < dataset.data.length; cont++) {
        dataset.data[cont] = dataset.data[cont] / totalAmount;
    }
    return dataset;
}

function getDatasetForQuarters(rawData) {
    const QUARTERS_IN_A_YEAR = 4;
    let dataset = {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        data: new Array(QUARTERS_IN_A_YEAR)
    };
    rawData.forEach((item) => {
        const MONTH_IN_A_QUARTER = 3;
        let itemMonth = parseInt(moment(item.date, "DD-MM-YYYY").format("M"));
        //0-base
        const QUARTER_INDEX = Math.floor((--itemMonth + MONTH_IN_A_QUARTER) / 3) - 1;
        if (dataset.data[QUARTER_INDEX] === undefined) {
            dataset.data[QUARTER_INDEX] = 0;
        }
        dataset.data[QUARTER_INDEX]++;
    });
    return dataset;
}