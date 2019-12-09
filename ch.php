<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
          integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">


    <!-- Charts.js CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css">

    <!-- HandsonTable CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/handsontable/0.28.4/handsontable.full.min.css">

    <title>Order Viewer</title>
    <link rel="stylesheet" href="./css/styles.css">
</head>
<body>
<h1>OrderViewer!</h1>
<nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
        <a class="nav-item nav-link active" id="nav-load-tab" data-toggle="tab" href="#nav-load" role="tab"
           aria-controls="nav-load" aria-selected="true">Load file</a>
        <a class="nav-item nav-link" id="nav-table-tab" data-toggle="tab" href="#nav-table" role="tab"
           aria-controls="nav-table" aria-selected="false">All orders</a>
        <a class="nav-item nav-link" id="nav-charts-tab" data-toggle="tab" href="#nav-charts" role="tab"
           aria-controls="nav-charts" aria-selected="false">Charts</a>
    </div>
</nav>
<div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="nav-load" role="tabpanel" aria-labelledby="nav-load-tab">
        <div id="load-container">
            <input type="file" id="input-file" accept=".csv">
        </div>
    </div>
    <div class="tab-pane fade" id="nav-table" role="tabpanel" aria-labelledby="nav-table-tab">
        <div id="table-container"></div>
    </div>
    <div class="tab-pane fade" id="nav-charts" role="tabpanel" aria-labelledby="nav-charts-tab">
        <div id="charts-container">
            <div style="width:45%;float:left">
                <canvas id="rev_day_b_day_chart"></canvas>
            </div>
            <div style="width:45%;float:left">
                <canvas id="countries_chart"></canvas>
            </div>
            <div style="width:100%;float:left;margin-top: 50px;">
                <canvas id="punch_chart"></canvas>
            </div>
        </div>
    </div>
</div>

<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
        integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"
        integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo"
        crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"
        integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"
        crossorigin="anonymous"></script>


<script src="https://cdn.jsdelivr.net/handsontable/0.28.4/handsontable.full.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/papaparse@5"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js"></script>

<script src="./js/app.js"></script>

</body>
</html>