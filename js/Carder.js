function Carder($, tot_revenues, tot_orders, start, end) {
    this.$ = $;
    this.tot_revenues = tot_revenues;
    this.tot_orders = tot_orders;
    this.start = start;
    this.end = end;

    this.cardContainerSelector = '.card-container';

    this.cardPeriodTimeId = 'summary-period-time';
    this.cardRevenuesId = 'summary-revenues-total';
    this.cardTotalsId = 'summary-orders-total';
    this.aovId = 'summary-orders-aov';
}

Carder.prototype.populateCards = function () {

    document.getElementById(this.cardPeriodTimeId).innerText = new Dater().getDateDay(this.start) + ' / ' + new Dater().getDateDay(this.end);
    document.getElementById(this.cardRevenuesId).innerText = this.tot_revenues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' EUR';
    document.getElementById(this.cardTotalsId).innerText = this.tot_orders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Orders';
    var aov = (this.tot_revenues / this.tot_orders).toFixed(2);
    document.getElementById(this.aovId).innerText = aov.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' EUR';
};
Carder.prototype.showCards = function () {
    this.$(this.cardContainerSelector).each(function (i) {
        jQuery(this).show(600);
    });
};