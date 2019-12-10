function Carder($, tot_revenues, tot_orders, start, end, total_items) {
    this.$ = $;
    this.tot_revenues = tot_revenues;
    this.tot_orders = tot_orders;
    this.start = start;
    this.end = end;
    this.total_items = total_items;

    this.cardContainerSelector = '.card-container';

    this.cardPeriodTimeId = 'summary-period-time';
    this.cardRevenuesId = 'summary-revenues-total';
    this.cardTotalsId = 'summary-orders-total';
    this.cardTotItemsId = 'summary-items-total';
    this.aovId = 'summary-orders-aov';
    this.aoiId = 'summary-orders-aoi';
}

Carder.prototype.populateCards = function () {

    document.getElementById(this.cardPeriodTimeId).innerText = new Dater().getDateDay(this.start) + ' / ' + new Dater().getDateDay(this.end);
    document.getElementById(this.cardRevenuesId).innerText = this.tot_revenues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' EUR';
    document.getElementById(this.cardTotalsId).innerText = this.tot_orders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Orders';
    document.getElementById(this.cardTotItemsId).innerText = this.total_items.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Items';
    var aov = (this.tot_revenues / this.tot_orders).toFixed(2);
    var aoi = (this.total_items / this.tot_orders).toFixed(2);
    document.getElementById(this.aovId).innerText = aov.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' EUR';
    document.getElementById(this.aoiId).innerText = aoi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
Carder.prototype.showCards = function () {
    this.$(this.cardContainerSelector).each(function (i) {
        jQuery(this).show(600);
    });
};