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
        stacked_bar_chart_type: "stacked_bar",
        hide_legend: false,
        show_legend: true,
        y_axis_begin_at_zero: true,
        y_axis_standard: false,
        tooltips_standard: false,
        tooltips_percentage: true,
        use_stack: true,
        no_stack: false,
        monthly_chart_title: "Fatturato mensile",
        sellers_chart_title: "Fatturato per venditore",
        quarters_chart_title: "Vendite per Quarter",
        monthly_sales_per_seller_chart_title: "Vendite mensili per venditore"
    };
    //context per le chart
    this.monthly_sales_context = $(".monthly_sales");
    this.seller_sales_context = $(".sellers_sales");
    this.quarters_sales_context = $(".quarters_sales");
    this.monthly_sales_per_sellers_context = $(".monthly_sales_per_sellers");
    //oggetto che fa le chiamate Ajax
    this.ajaxCall = new AjaxCall();
    let outerThis = this;
    this.ajaxCall.doCall(this.ajaxCall.getBaseUri(), this.ajaxCall.methodGet(), rawData => {
        printData.call(outerThis, rawData);
    });
    //listener per tasti premuti nella input
    attachListenerForOnlyNumbersToInputText($("#value"));
    // TODO da cancellare
    // new Chart($(".monthly_sales_per_sellers"), {
    //     type: 'bar',
    //     data: {
    //         labels: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
    //         datasets: [
    //             {
    //                 //MARCO
    //                 label: 'marco',
    //                 data: [0, 9750, 0, 1250, 0, 3250, 2250, 0, 3450, 1150, 4550, 1550],
    //                 backgroundColor: [
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                     "rgba(167, 148, 130, 0.3)",
    //                 ],
    //                 borderColor: [
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)'
    //                 ],
    //                 borderWidth: 1
    //             }, {
    //                 //GIUSEPPE
    //                 label: 'giuseppe',
    //                 data: [750, 2480, 2580, 1000, 5800, 0, 0, 5600, 0, 4800, 0, 4900],
    //                 backgroundColor: [
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)',
    //                     'rgba(147, 89, 64, 0.2)'
    //                 ],
    //                 borderColor: [
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)'
    //                 ],
    //                 borderWidth: 1
    //             }, {
    //                 //RICCARDO
    //                 label: 'riccardo',
    //                 data: [3200, 2300, 4200, 4000, 1300, 1340, 4350, 0, 4350, 8250, 0, 2010],
    //                 backgroundColor: [
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)',
    //                     'rgba(155, 159, 64, 0.2)'
    //                 ],
    //                 borderColor: [
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)'
    //                 ],
    //                 borderWidth: 1
    //             }, {
    //                 //ROBERTO
    //                 label: 'roberto',
    //                 data: [2010, 3010, 7010, 1350, 7850, 2850, 0, 0, 550, 1550, 6550, 0],
    //                 backgroundColor: [
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)',
    //                     'rgba(255, 159, 64, 0.2)'
    //                 ],
    //                 borderColor: [
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)',
    //                     'rgba(0, 0, 0, 1)'
    //                 ],
    //                 borderWidth: 1
    //             }]
    //     },
    //     options: {
    //         responsive: true,
    //         maintainAspectRatio: false,
    //         title: {
    //             display: true,
    //             position: "top",
    //             text: "Vendite mensili per venditore"
    //         },
    //         legend: {
    //             display: true,
    //             position: "bottom"
    //         },
    //         scales: {
    //             yAxes: [{
    //                 stacked: true,
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }],
    //             xAxes: [{
    //                 stacked: true,
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // });

});

//funzione che collega un listener nella input text passata per abilitare la pressione di soli numeri, 1 punto e tasti cancella
function attachListenerForOnlyNumbersToInputText(inputText) {
    inputText.keypress(function (event) {
        //ammessi solo numeri, punto, cancella
        switch (event.keyCode) {
            //tasti ammessi
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
            case 13:
                //tasto invio
                $(".button_add").trigger("click");
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
    let monthlySalesPerSellerData = getDataForMonthlySalesPerSeller(rawData);
    //aggiungo i venditori alla select
    addSellersToSelect(sellersData.labels);
    //creo l'oggetto options per i grafici
    let monthlyChartOptions = getChartOptions(this.leterals.hide_legend, this.leterals.monthly_chart_title, this.leterals.tooltips_standard, this.leterals.y_axis_standard, this.leterals.no_stack);
    let sellersChartOptions = getChartOptions(this.leterals.show_legend, this.leterals.sellers_chart_title, this.leterals.tooltips_percentage, this.leterals.y_axis_standard, this.leterals.no_stack);
    let quartersChartOptions = getChartOptions(this.leterals.hide_legend, this.leterals.quarters_chart_title, this.leterals.tooltips_standard, this.leterals.y_axis_begin_at_zero, this.leterals.no_stack);
    let monthlySalesPerSellerChartOptions = getChartOptions(this.leterals.show_legend, this.leterals.monthly_sales_per_seller_chart_title, this.leterals.tooltips_standard, this.leterals.y_axis_standard, this.leterals.use_stack);
    //creo i grafici
    this.monthlyChart = createChart(this.monthly_sales_context, this.leterals.line_chart_type, monthlyChartOptions, monthlyData);
    this.sellersChart = createChart(this.seller_sales_context, this.leterals.doughnut_chart_type, sellersChartOptions, sellersData);
    this.quartersChart = createChart(this.quarters_sales_context, this.leterals.bar_chart_type, quartersChartOptions, quartersData);
    this.montlySalesPerSellerChart = createChart(this.monthly_sales_per_sellers_context, this.leterals.stacked_bar_chart_type, monthlySalesPerSellerChartOptions, monthlySalesPerSellerData);
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
        let monthlySalesPerSellerData = getDataForMonthlySalesPerSeller(rawData);
        outerThis.monthlyChart.data.datasets[0].data = monthlyData.data;
        outerThis.sellersChart.data.datasets[0].data = sellersData.data;
        outerThis.quartersChart.data.datasets[0].data = quartersData.data;
        outerThis.montlySalesPerSellerChart.data.datasets.forEach(chartItem => {
            monthlySalesPerSellerData.forEach(newDatasetItem => {
               if(chartItem.label === newDatasetItem.label){
                   chartItem.data = newDatasetItem.data;
               }
            });
        });
        outerThis.monthlyChart.update();
        outerThis.sellersChart.update();
        outerThis.quartersChart.update();
        outerThis.montlySalesPerSellerChart.update();
    });
}

//funzione che cambia i colori usati nei grafici
function changeColors(...charts) {
    //per ogni grafico passato cambio il colore
    charts.forEach(chart => {
        if (chart.config.type === "line") {
            chart.data.datasets[0].borderColor = getRandomArrayColors(1, false)[0];
        } else {
            chart.data.datasets[0].backgroundColor = getRandomArrayColors(chart.data.datasets[0].data.length, true);
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
            dataset.borderColor = getRandomArrayColors(1, false)[0];
            dataset.data = data.data;
            dataset = [dataset];
            break;
        case "bar":
        case "doughnut":
            //nel caso di bar e pie specifico i colori di background che saranno tanti quanti i dati da visualizzare
            colors = getRandomArrayColors(data.data.length, false);
            dataset.backgroundColor = colors;
            dataset.data = data.data;
            dataset = [dataset];
            break;
        case "stacked_bar":
            chartType = "bar";
            dataset = data;
            console.log(dataset);
            //ogni venditore deve avere un colore e questo colore deve essere ripetutto tante volte quanti sono i valore in x
            let sellerColors = getRandomArrayColors(dataset.length, true);
            //ciclo sugli elementi venditore nell'array per impostare il colore del bordo - per tutti uguale
            //e il colore di sfondo ovvero il colore venditore
            for (let cont = 0; cont < dataset.length; cont++) {
                dataset[cont].borderWidth = 1;
                dataset[cont].borderColor = new Array(dataset[cont].data.length).fill("rgba(0, 0, 0, 1)");
                dataset[cont].backgroundColor = new Array(dataset[cont].data.length).fill(sellerColors[cont]);
            }
            break;
        default:
            throw "Unsupported chart type exception";
    }
    return new Chart(context, {
        type: chartType,
        data: {
            labels: data.labels,
            datasets: dataset
        },
        options: options
    });
}

//funzione che ritorna un array di colori random univoci
function getRandomArrayColors(colorsCount, useAlpha) {
    let colors = [];
    let o = Math.round, r = Math.random, s = 255;
    while (colors.length < colorsCount) {
        let randomColor = "";
        if (useAlpha) {
            randomColor = 'rgba(' + o(r() * s) + ', ' + o(r() * s) + ', ' + o(r() * s) + ', ' + 0.3 + ')';
        } else {
            randomColor = 'rgba(' + o(r() * s) + ', ' + o(r() * s) + ', ' + o(r() * s) + ', ' + 1 + ')';
        }
        if (colors.length === 0 || !colors.includes(randomColor)) {
            colors.push(randomColor);
        }
    }
    return colors;
}

//funzione che ritorna un oggetto di configurazione per il grafico (proprietà options)
function getChartOptions(showLegend, title, percentageTooltip, yAxisBegiAtZero, useStack) {
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
    //se richiesto effettuo lo stack dei valori - provoca in automatico il valore di partenza in y uguale a 0
    if (useStack) {
        configOptions.scales = {
            yAxes: [{
                stacked: true,
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                stacked: true,
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

// funzione che ritorna un oggetto contenente le etichette e i valori da impostare nel grafico del fatturato mensile
function getDataForMonthlySales(rawData) {
    const MONTHS_IN_A_YEAR = 12;
    let dataset = {
        labels: new Array(MONTHS_IN_A_YEAR),
        data: new Array(MONTHS_IN_A_YEAR)
    };
    rawData.forEach((item) => {
        //0-base
        const MONTH_INDEX = parseInt(moment(item.date, "DD/MM/YYYY").format("M")) - 1;
        dataset.labels[MONTH_INDEX] = moment(item.date, "DD/MM/YYYY").format("MMMM").capitalizeFirst();
        if (dataset.data[MONTH_INDEX] === undefined) {
            dataset.data[MONTH_INDEX] = 0;
        }
        dataset.data[MONTH_INDEX] += parseFloat(item.amount);
    });
    return dataset;
}

// funzione che ritorna un oggetto contenente le etichette e i valori da impostare nel grafico della percentuale di fatturato per venditore
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

// funzione che ritorna un oggetto contenente le etichette e i valori da impostare nel grafico del fatturato per trimestre
function getDataForQuarters(rawData) {
    const QUARTERS_IN_A_YEAR = 4;
    let dataset = {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        data: new Array(QUARTERS_IN_A_YEAR)
    };
    rawData.forEach((item) => {
        const MONTH_IN_A_QUARTER = 3;
        //0-base
        let itemMonth = parseInt(moment(item.date, "DD/MM/YYYY").format("M")) - 1;
        //0-base
        const QUARTER_INDEX = Math.floor((itemMonth + MONTH_IN_A_QUARTER) / 3) - 1;
        if (dataset.data[QUARTER_INDEX] === undefined) {
            dataset.data[QUARTER_INDEX] = 0;
        }
        dataset.data[QUARTER_INDEX]++;
    });
    return dataset;
}

// funzione che ritorna un oggetto contenente le etichette e i valori da impostare nel grafico del fatturato mensile per venditore
function getDataForMonthlySalesPerSeller(rawData) {
    //ogni oggetto dell'array sarà un oggetto venditore avente come proprietà
    //label:nome venditore
    //data:array di lunghezza fissa(12) inizializzato a 0 contenente le vendite del venditore per ogni mese
    //backgroundColor: array con i colori usati per lo sfondo delle stacked bar
    //inoltre nell'array viene impostata una proprietà labels: array con i nomi dei mesi
    let dataset = [];
    const MONTHS_NAMES = [];
    const MONTHS_IN_A_YEAR = 12;
    for (let cont = 1; cont <= MONTHS_IN_A_YEAR; cont++) {
        MONTHS_NAMES.push(moment(cont, "M").format("MMMM").capitalizeFirst());
    }
    //proprietà dell'array che contiene un array con il nome dei mesi
    dataset.labels = MONTHS_NAMES;
    //ciclo sugli elementi
    rawData.forEach(item => {
        //verifico se il venditore è già nel dataset
        let sellerIndex = -1;
        for (let cont = 0; cont < dataset.length; cont++) {
            if (dataset[cont].label === item.salesman) {
                sellerIndex = cont;
            }
        }
        if (sellerIndex === -1) {
            //il venditore non esiste, lo aggiungo come oggetto nel dataset
            let newSeller = {
                label: item.salesman.capitalizeFirst(),
                data: new Array(MONTHS_IN_A_YEAR).fill(0)
            };
            dataset.push(newSeller);
            //l'indice dell'elemento inserito sarà uguale alla lunghezza dell'array-1
            sellerIndex = dataset.length - 1;
        }
        const MONTH_INDEX = parseInt(moment(item.date, "DD/MM/YYYY").format("M")) - 1;
        dataset[sellerIndex].data[MONTH_INDEX] += parseFloat(item.amount);
    });
    return dataset;
}