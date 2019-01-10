//impostazione locale per momentJS
moment.locale('it');
//metodo prototype di utilità
String.prototype.capitalizeFirst = function () {
    return this.charAt(0).toUpperCase() + this.substring(1);
};

$(function () {
    //oggetto con letterali per maggiore leggibilità degli argomenti passati nelle funzioni
    this.leterals = {
        line_chart_type: "line",
        doughnut_chart_type: "doughnut",
        bar_chart_type: "bar",
        hide_legend: false,
        show_legend: true,
        y_axis_begin_at_zero: true,
        y_axis_standard: false,
        tooltips_standard: false,
        tooltips_percentage: true,
        monthly_chart_title: "Fatturato mensile",
        sellers_chart_title: "Fatturato per venditore",
        quarters_chart_title: "Vendite per Quarter"
    };
    //context per le chart
    this.monthly_sales_context = $(".monthly_sales");
    this.seller_sales_context = $(".sellers_sales");
    this.quarters_sales_context = $(".quarters_sales");
    //oggetto che fa le chiamate Ajax
    this.ajaxCall = new AjaxCall();
    let outerThis = this;
    this.ajaxCall.doCall(this.ajaxCall.getBaseUri(), this.ajaxCall.methodGet(), rawData => {
        printData.call(outerThis, rawData);
    });
    //listener per tasti premuti nella input
    attachListenerForOnlyNumbersToInputText($("#value"));
});

//funzione che collega un listener nella input text passata per abilitare la pressione di soli numeri, 1 punto e tasti cancella
function attachListenerForOnlyNumbersToInputText(inputText) {
    inputText.keypress(function (event) {
        //ammessi solo numeri, punto, cancella
        switch (event.keyCode) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 8:
                break;
            case 46:
                //1 solo punto ammesso
                if (inputText.val().includes(".")) {
                    event.preventDefault();
                }
                break;
            default:
                event.preventDefault();
        }
    });
}

function printData(rawData) {
    //elaboro i dati
    let monthlyData = getDataForMonthlySales(rawData);
    let sellersData = getDataForSellersSales(rawData);
    let quartersData = getDataForQuarters(rawData);
    //aggiungo i venditori alla select
    addSellersToSelect(sellersData.labels);
    //creo l'oggetto options per i grafici
    let monthlyChartOptions = getChartOptions(this.leterals.hide_legend, this.leterals.monthly_chart_title, this.leterals.tooltips_standard, this.leterals.y_axis_standard);
    let sellersChartOptions = getChartOptions(this.leterals.show_legend, this.leterals.sellers_chart_title, this.leterals.tooltips_percentage, this.leterals.y_axis_standard);
    let quartersChartOptions = getChartOptions(this.leterals.hide_legend, this.leterals.quarters_chart_title, this.leterals.tooltips_standard, this.leterals.y_axis_begin_at_zero);
    //creo i grafici
    this.monthlyChart = createChart(this.monthly_sales_context, this.leterals.line_chart_type, monthlyChartOptions, monthlyData);
    this.sellersChart = createChart(this.seller_sales_context, this.leterals.doughnut_chart_type, sellersChartOptions, sellersData);
    this.quartersChart = createChart(this.quarters_sales_context, this.leterals.bar_chart_type, quartersChartOptions, quartersData);
    //listener pulsante per il cambio colore
    attachChangeColorsButtonListener.call(this);
    //listener pulsante aggiunta valori
    attachAddValueButtonListener.call(this);
}

// funzione che collega listener su pulsante che cambia i colori e processa l'elaborazione
function attachChangeColorsButtonListener() {
    let outerThis = this;
    $(".button_change_colors").click(function () {
        changeColors(outerThis.monthlyChart, outerThis.sellersChart, outerThis.quartersChart);
    });
}

// funzione che collega listener su pulsante che aggiunge i valori e processa l'elaborazione
function attachAddValueButtonListener() {
    let outerThis = this;
    $(".button_add").click(function () {
        let valueToAdd = parseFloat($("#value").val());
        //controllo se il valore immesso è un numero
        if (isNaN(valueToAdd)) {
            //non è un numero - aggiungo bordo rosso
            $("#value").removeClass("value--standard");
            $("#value").addClass("value--error");
            return;
        }
        //rimuovo eventuali bordi rossi precedenti
        $("#value").removeClass("value--error");
        $("#value").addClass("value--standard");
        //cancello valore inserito
        $("#value").val("");
        //preparo oggetto data
        let postData = {
            salesman: $("#sellers").val(),
            amount: valueToAdd,
            date: "1/" + $("#months").val() + "/2017"
        };
        //chiamata
        outerThis.ajaxCall.doCall(outerThis.ajaxCall.getBaseUri(), outerThis.ajaxCall.methodPost(), () => {
            updateDataset.call(outerThis);
        }, null, postData);
    });
}

function updateDataset() {
    let outerThis = this;
    this.ajaxCall.doCall(outerThis.ajaxCall.getBaseUri(), outerThis.ajaxCall.methodGet(), rawData => {
        // elaboro i dati
        let monthlyData = getDataForMonthlySales(rawData);
        let sellersData = getDataForSellersSales(rawData);
        let quartersData = getDataForQuarters(rawData);
        outerThis.monthlyChart.data.datasets[0].data = monthlyData.data;
        outerThis.sellersChart.data.datasets[0].data = sellersData.data;
        outerThis.quartersChart.data.datasets[0].data = quartersData.data;
        outerThis.monthlyChart.update();
        outerThis.sellersChart.update();
        outerThis.quartersChart.update();
    });
}

//funzione che cambia i colori usati nei grafici
function changeColors(...charts) {
    //per ogni grafico passato cambio il colore
    charts.forEach(chart => {
        if (chart.config.type === "line") {
            chart.data.datasets[0].borderColor = getRandomArrayColors(1)[0];
        } else {
            chart.data.datasets[0].backgroundColor = getRandomArrayColors(chart.data.datasets[0].data.length);
        }
        chart.update();
    });
}

//funziona che popola la select dei venditori
function addSellersToSelect(sellers) {
    //creo nuovo array in quanto andrò a ordinare la lista alfabeticamente
    sellers = sellers.slice(0);
    sellers.sort();
    $("#sellers").html(getHtmlFromHandlebars(sellers));
}

// funzione di utilità per handlebars
function getHtmlFromHandlebars(data) {
    let source = $("#select_template").html();
    let template = Handlebars.compile(source);
    return template({list: data});
}

//funzione che crea un oggetto grafico e lo ritorna
function createChart(context, chartType, options, data) {
    let colors = [];
    let dataset = {};
    //proprietà specifiche del dataset per tipo di grafico
    switch (chartType) {
        case "line":
            dataset.lineTension = 0;
            dataset.fill = false;
            // nel caso di line posso solo specificare un colore del border color che sarà quindi il primo elemento dell'array colors
            dataset.borderColor = getRandomArrayColors(1)[0];
            break;
        case "bar":
        case "doughnut":
            //nel caso di bar e pie specifico i colori di background che saranno tanti quanti i dati da visualizzare
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
        if ((colors.length === 0 || !colors.includes(randomColor)) && randomColor.length === 7) {
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
        dataset.data[MONTH_INDEX - 1] += parseFloat(item.amount);
    });
    return dataset;
}

function getDataForSellersSales(rawData) {
    let totalAmount = 0;
    let dataset = {
        labels: [],
        data: []
    };
    rawData.forEach((item) => {
        let salesmanIndex = dataset.labels.indexOf(item.salesman);
        if (salesmanIndex === -1) {
            dataset.labels.push(item.salesman.capitalizeFirst());
            dataset.data.push(parseFloat(item.amount));
        } else {
            dataset.data[salesmanIndex] += parseFloat(item.amount);
        }
        totalAmount += parseFloat(item.amount);
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