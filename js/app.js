/* global FileReader, Papa, Handsontable */

var input = document.getElementById('inputGroupFile01');
var handsontableContainer = document.getElementById('table-container');
var charter = new Charter(jQuery);

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
        var orders_day_b_day = [];
        var punches = [];
        var weekdays = [];
        var _countries = [];

        var summary_revenues_total = 0;
        var summary_orders_total = 0;
        var total_items = 0;
        var _start_date = new Date().getTime();
        var _end_date = new Date(0).getTime();
        var start_date = '';
        var end_date = '';

        jQuery(actual_data).each(function (i) {
            var _el = jQuery(this);
            if (_el.length) {
                var el = _el[0];

                var thisdate = new Dater().getDate(el['CREATED']);
                var state = el['STATE'];
                var country = el['STORE NAME'];
                var dateday = new Dater().getDateDay(thisdate);

                if (valid_states.includes(state)) {
                    var this_total = parseFloat(el['TOTAL IN EUR']);
                    total_items += parseInt(el['TOTAL ITEMS']);
                    var this_ts = thisdate.getTime();

                    summary_revenues_total += this_total;
                    summary_orders_total++;
                    if (this_ts > _end_date) {
                        _end_date = this_ts;
                        end_date = thisdate;
                    }
                    if (this_ts < _start_date) {
                        _start_date = this_ts;
                        start_date = thisdate;
                    }


                    if (typeof rev_day_b_day[dateday] === 'undefined') {
                        rev_day_b_day[dateday] = this_total;
                        orders_day_b_day[dateday] = 1;
                    }
                    else {
                        rev_day_b_day[dateday] = rev_day_b_day[dateday] + this_total;
                        orders_day_b_day[dateday] += 1;
                    }

                    if (typeof _countries[country] === 'undefined') {
                        _countries[country] = {label: country, val: 1};
                    }
                    else {
                        _countries[country].val = _countries[country].val + 1;
                    }


                    if (typeof punches[thisdate.getDay()] === 'undefined') {
                        punches[thisdate.getDay()] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        weekdays[thisdate.getDay()] = this_total;
                    } else {
                        weekdays[thisdate.getDay()] += this_total;
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


        var aov_day_b_day = [];

        Object.keys(rev_day_b_day).forEach(
            function (i) {
                aov_day_b_day[i] = (rev_day_b_day[i] / orders_day_b_day[i]).toFixed(2);
            }
        );

        var cumulated_revenues = [];
        var cumulated_total = 0;

        Object.keys(rev_day_b_day).reverse().forEach(
            function (i) {
                cumulated_total += rev_day_b_day[i];
                cumulated_revenues[i] = cumulated_total;
            }
        );

        // Charts
        charter.loadCharts(rev_day_b_day.reverse(), orders_day_b_day.reverse(), aov_day_b_day.reverse(), cumulated_revenues.reverse(), weekdays, _countries, punches);
        charter.showCharts();

        // Cards
        var carder = new Carder(jQuery, summary_revenues_total, summary_orders_total, start_date, end_date, total_items);
        carder.populateCards();
        carder.showCards();

        // Table
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







