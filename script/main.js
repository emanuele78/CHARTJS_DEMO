$(function () {
    //impostazione locale per momentJS
    moment.locale('it');
    //metodo prototype di utilità
    String.prototype.capitalizeFirst = function () {
        return this.charAt(0).toUpperCase() + this.substring(1);
    };
    //effettuo la chiamata Ajax
    let ajaxCall = new AjaxCall();
    ajaxCall.doCall(ajaxCall.getBaseUri(), ajaxCall.methodGet(), rawData => {
        printData(rawData)
    });
});

function printData(rawData) {
    const MONTHLY_SALES_CONTEXT = $(".monthly_sales");
    const SELLER_SALES_CONTEXT = $(".sellers_sales");
    const QUARTERS_SALES_CONTEXT = $(".quarters_sales");
    const LINE_CHART_TYPE = "line";
    const DOUGHNUT_CHART_TYPE = "doughnut";
    const BAR_CHART_TYPE = "bar";
    let monthlyData = getDataForMonthlySales(rawData);
    let sellersData = getDataForSellersSales(rawData);
    let quartersData = getDataForQuarters(rawData);
    let monthlyChartOptions = getChartOptions(false, "Fatturato mensile", false, false);
    let sellerChartOptions = getChartOptions(true, "Fatturato per venditore", true, false);
    let quarterChartOptions = getChartOptions(false, "Vendite per Quarter", false, true);
    createChart(MONTHLY_SALES_CONTEXT, LINE_CHART_TYPE, monthlyChartOptions, monthlyData);
    createChart(SELLER_SALES_CONTEXT, DOUGHNUT_CHART_TYPE, sellerChartOptions, sellersData);
    createChart(QUARTERS_SALES_CONTEXT, BAR_CHART_TYPE, quarterChartOptions, quartersData);
}

function createChart(context, chartType, options, data) {
    let colors = [];
    let dataset = {};
    //proprietà specifiche del dataset per tipo di grafico
    switch (chartType) {
        case "line":
            dataset.lineTension = 0;
            dataset.fill = false;
            colors = getRandomArrayColors(1);
            dataset.borderColor = colors[0];
            break;
        case "bar":
        case "doughnut":
            colors = getRandomArrayColors(data.data.length);
            dataset.backgroundColor = colors;
            break;
        default:
            throw "Unsupported chart type exception";
    }
    //proprietà comune del dataset per tutti i grafici
    dataset.data = data.data;
    return new Chart(context, {
        type: chartType,
        data: {
            labels: data.labels,
            datasets: [dataset]
        },
        options: options
    });
}

//funzione che ritorna un array di colori random univoci
function getRandomArrayColors(colorsCount) {
    let colors = [];
    while (colors.length < colorsCount) {
        let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        if (colors.length === 0 || !colors.includes(randomColor)) {
            colors.push(randomColor);
        }
    }
    return colors;
}

//funzione che ritorna un oggetto di configurazione per il grafico (proprietà options)
function getChartOptions(showLegend, title, percentageTooltip, yAxisBegiAtZero) {
    //impostazioni comuni
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
    //se richiesto modifico il tooltip mostrando label corrent + valore in percentuale
    if (percentageTooltip) {
        configOptions.tooltips = {
            callbacks: {
                label: function (tooltipItem, data) {
                    let currentValue = data.datasets[0].data[tooltipItem.index];
                    let currentLabel = " " + data.labels[tooltipItem.index];
                    return currentLabel + ": " + parseFloat(Math.round(currentValue * 100)).toFixed(2) + "%";
                }
            }
        };
    }
    //se richiesto forzo valore di partenza asse y a 0
    if (yAxisBegiAtZero) {
        configOptions.scales = {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        };
    }
    return configOptions;
}

//costruttore oggetto Ajax
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

function getDataForMonthlySales(rawData) {
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

function getDataForSellersSales(rawData) {
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

function getDataForQuarters(rawData) {
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