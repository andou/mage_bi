/* global FileReader, Papa, Handsontable */

var input = document.getElementById('input-file');
var handsontableContainer = document.getElementById('table-container');

input.onchange = function () {
    var file = this.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var csv = e.target.result;

        var data = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true
        });

        var actual_data = data['data'];

        var valid_states = ['complete', 'processing'];
        var rev_day_b_day = [];
        var _countries = [];
        var punches = [];

        jQuery(actual_data).each(function (i) {
            var _el = jQuery(this);
            if (_el.length) {
                var el = _el[0];

                var thisdate = getDate(el['CREATED']);
                var state = el['STATE'];
                var country = el['STORE NAME'];
                var dateday = getDateDay(thisdate);

                if (valid_states.includes(state)) {
                    if (typeof rev_day_b_day[dateday] === 'undefined') {
                        rev_day_b_day[dateday] = parseFloat(el['TOTAL IN EUR']);
                    }
                    else {
                        rev_day_b_day[dateday] = rev_day_b_day[dateday] + parseFloat(el['TOTAL IN EUR']);
                    }

                    if (typeof _countries[country] === 'undefined') {
                        _countries[country] = {label: country, val: 1};
                    }
                    else {
                        _countries[country].val = _countries[country].val + 1;
                    }


                    if (typeof punches[thisdate.getDay()] === 'undefined') {
                        punches[thisdate.getDay()] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    }

                    if (typeof punches[thisdate.getDay()][thisdate.getHours()] === 'undefined') {
                        punches[thisdate.getDay()][thisdate.getHours()] = 1;
                    }
                    else {
                        punches[thisdate.getDay()][thisdate.getHours()] = punches[thisdate.getDay()][thisdate.getHours()] + 1
                    }

                }
            }
        });

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


        loadCharts(rev_day_b_day.reverse(), countries, punches);

        // reset container
        handsontableContainer.innerHTML = '';
        handsontableContainer.className = '';

        Handsontable(handsontableContainer, {
            data: data.data,
            rowHeaders: true,
            colHeaders: data.meta.fields,
            columnSorting: true
        })
    };

    reader.readAsText(file)
};

function getDate(dateString) {
    return new Date(dateString);
}

function getDateDay(date) {
    var monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return year + ' ' + monthNames[monthIndex] + ' ' + day;
}

function loadCharts(rev_data, countries_data, punch_data) {

    new Chart(document.getElementById('rev_day_b_day_chart'), {
        type: 'line',
        data: {
            labels: getChartLabels(rev_data),
            datasets: [
                composeDataset('Revenues', getDataSetValues(rev_data))
            ]
        },
        options: {
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
            labels: getChartObjLabels(countries_data),
            datasets: [
                composeDataset('Countries', getDataSetObjValues(countries_data))
            ]
        }
    });

    var punch_step = 10;
    var punch_tick = 4;

    new Chart(document.getElementById('punch_chart'), {
        type: 'bubble',
        data: {
            datasets: [
                composeDataset('Monday', getPunchValues(punch_data, 0, punch_step, punch_tick), 'rgba(255, 0, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                composeDataset('Tuesday', getPunchValues(punch_data, 1, punch_step, punch_tick), 'rgba(255, 100, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                composeDataset('Wednesday', getPunchValues(punch_data, 2, punch_step, punch_tick), 'rgba(255, 150, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                composeDataset('Thursday', getPunchValues(punch_data, 3, punch_step, punch_tick), 'rgba(255, 200, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                composeDataset('Friday', getPunchValues(punch_data, 4, punch_step, punch_tick), 'rgba(255, 250, 64, 0.2)', 'rgba(0, 0, 0, 1)'),
                composeDataset('Saturday', getPunchValues(punch_data, 5, punch_step, punch_tick), 'rgba(255, 250, 0, 0.2)', 'rgba(0, 0, 0, 1)'),
                composeDataset('Sunday', getPunchValues(punch_data, 6, punch_step, punch_tick), 'rgba(250, 250, 0, 0.2)', 'rgba(0, 0, 0, 1)')
            ]
        },
        options: {
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
                            label += '  (' + getHourFromX(hourx) + ':00 / ' + getHourFromX(hourx + 4) + ':00): ';
                        }
                        label += ordx + ' Orders';
                        return label;
                    }
                }
            }
        }
    });
}

function getHourFromX(x, size, punch_tick = 4) {
    var _x = parseInt((x - (punch_tick / 2)) / punch_tick);
    var s = String(_x);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

function getChartLabels(data) {
    return Object.keys(data).reverse();
}

function getDataSetValues(data) {
    return Object.values(data).reverse();
}

function getChartObjLabels(data) {
    var res = [];
    jQuery(data).each(function (i) {
        res.push(this.label);
    });
    return res;
}

function getDataSetObjValues(data) {
    var res = [];
    jQuery(data).each(function (i) {
        res.push(this.val);
    });
    return res;
}

function getPunchValues(data, idx, punch_step, punch_tick) {
    var res = [];
    jQuery(data[idx]).each(function (i) {
        res.push({
            x: (punch_tick / 2) + (i * punch_tick),
            y: (punch_step / 2) + ((6 - idx) * punch_step),
            r: parseInt(this) * 2
        });
    });
    return res;
}

function composeDataset(label,
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

}





