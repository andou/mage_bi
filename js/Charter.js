function Charter($) {
    this.$ = $;
    this.chartContainerSelector = '.chart-container';
}


Charter.prototype.orderCountries = function (_countries) {
    _countries = Object.values(_countries);

    var countries = _countries.sort(function (ca, cb) {
        if (ca.val < cb.val) {
            return 1;
        }
        if (ca.val > cb.val) {
            return -1;
        }
        return 0;
    });
    return countries;
};

/**
 *
 */
Charter.prototype.showCharts = function () {
    this.$(this.chartContainerSelector).each(function (i) {
        jQuery(this).show(600);
    });
};

Charter.prototype.getChartLabels = function (data) {
    return Object.keys(data).reverse();
};

Charter.prototype.composeDataset = function (label,
                                             data,
                                             bgColors = ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                                             bdColors = ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)']) {

    return {
        label: label,
        data: data,
        backgroundColor: bgColors,
        borderColor: bdColors,
        borderWidth: 1
    };

};


Charter.prototype.getDataSetValues = function (data) {
    return Object.values(data).reverse();
};


Charter.prototype.getChartObjLabels = function (data) {
    var res = [];
    jQuery(data).each(function (i) {
        res.push(this.label);
    });
    return res;
};


Charter.prototype.getDataSetObjValues = function (data) {
    var res = [];
    jQuery(data).each(function (i) {
        res.push(this.val);
    });
    return res;
};


Charter.prototype.getPunchValues = function (data, idx, punch_step, punch_tick) {
    var res = [];
    jQuery(data[idx]).each(function (i) {
        res.push({
            x: (punch_tick / 2) + (i * punch_tick),
            y: (punch_step / 2) + ((6 - idx) * punch_step),
            r: parseInt(this) * 2
        });
    });
    return res;
};


Charter.prototype.loadCharts = function (rev_data, _countries_data, punch_data) {

    var countries_data = this.orderCountries(_countries_data);

    new Chart(document.getElementById('rev_day_b_day_chart'), {
        type: 'line',
        data: {
            labels: this.getChartLabels(rev_data),
            datasets: [
                this.composeDataset('Revenues', this.getDataSetValues(rev_data))
            ]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                fontFamily: 'Arimo',
                text: 'Revenues Day By Day'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    new Chart(document.getElementById('countries_chart'), {
        type: 'pie',
        data: {
            labels: this.getChartObjLabels(countries_data),
            datasets: [
                this.composeDataset('Countries', this.getDataSetObjValues(countries_data))
            ]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                fontFamily: 'Arimo',
                text: 'Orders By Country'
            }
        }
    });

    var punch_step = 10;
    var punch_tick = 4;

    new Chart(document.getElementById('punch_chart'), {
        type: 'bubble',
        data: {
            datasets: [
                this.composeDataset('Monday', this.getPunchValues(punch_data, 0, punch_step, punch_tick), 'rgba(255, 0, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                this.composeDataset('Tuesday', this.getPunchValues(punch_data, 1, punch_step, punch_tick), 'rgba(255, 100, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                this.composeDataset('Wednesday', this.getPunchValues(punch_data, 2, punch_step, punch_tick), 'rgba(255, 150, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                this.composeDataset('Thursday', this.getPunchValues(punch_data, 3, punch_step, punch_tick), 'rgba(255, 200, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                this.composeDataset('Friday', this.getPunchValues(punch_data, 4, punch_step, punch_tick), 'rgba(255, 250, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                this.composeDataset('Saturday', this.getPunchValues(punch_data, 5, punch_step, punch_tick), 'rgba(255, 250, 0, 0.2)', 'rgba(0, 0, 0, 1)'),
                this.composeDataset('Sunday', this.getPunchValues(punch_data, 6, punch_step, punch_tick), 'rgba(250, 250, 0, 0.2)', 'rgba(0, 0, 0, 1)')
            ]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                fontFamily: 'Arimo',
                text: 'Orders Punch Card'
            },
            scales: {
                xAxes: [{
                    display: false,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    display: false,
                    ticks: {
                        beginAtZero: true,
                        max: 70,
                        stepSize: punch_step
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var ordx = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].r;
                        var hourx = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].x;
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += '  (' + new Dater().getHourFromX(hourx) + ':00 / ' + new Dater().getHourFromX(hourx + 4) + ':00): ';
                        }
                        label += ordx + ' Orders';
                        return label;
                    }
                }
            }
        }
    });
};