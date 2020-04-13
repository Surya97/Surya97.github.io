window.onload = function(){
    getMetadata();
    initPlot();
};

var chart;

function initPlot(){
    chart = new Highcharts.chart({
        chart: {
            renderTo: 'mainPlot',
            type: 'scatter',
        },
        title:{
            text:null
        }
    });
    chart.showLoading();
    setTimeout(function(){
        chart = Highcharts.chart('mainPlot', {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                events: {
                    click: unselectByClick,
                }
            },
            tooltip:{
                crosshairs: true
            },
            title:{
                text: null
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Average Sentiment'
                },
                startOnTick: false,
                gridLineWidth: false,
                showFirstLabel: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Average Rating'
                },
                gridLineWidth: 0,
                showFirstLabel: false,
                showLastLabel: false
            },
            legend: {
                enabled: false
                // layout: 'vertical',
                // align: 'left',
                // verticalAlign: 'top',
                // x: 100,
                // y: 70,
                // floating: true,
                // backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
                // borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 8,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            },
                            select:{
                                fillColor: 'rgb(83, 83, 225)',
                                lineWidth: 1,
                                lineColor: '#ffffff',
                                radius: 10
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        crosshairs: true,
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: 'Title: {point.title} <br/> Sentiment Score: {point.sentimentValue} <br/> Rating: {point.rating}'
                    },
                    jitter:{
                        x: 0.015,
                        y: 0.01,
                    }
                },
                series:{
                    allowPointSelect: true,
                    cursor: 'pointer',
                    point: {
                        events:{
                            select: function(e) {

                                $("#displayText").html(e);
                                console.log(e);
                                var modal = document.getElementById("myModal");
                                modal.style.display = "block";
                                var modaljq = $('#myModal');
                                var span = document.getElementsByClassName("close")[0];
                                var spn3 = modaljq.find('.col-md-3');
                                spn3.empty().append('<img src="'+ e.target.options.image[0] +'" height="64px" width="64px">');
                                modaljq.find('.modal-header h4').text(e.target.options.title);

                            }
                        }
                    }
                }
            },
            series: [{
                data: processChartData(null),
                color: 'rgba(83, 83, 223, 0.7)',
                name: 'Amazon Fashion'
            }]
        })

    }, 3000);

}

//handle the click function to show the modal
function handleClick(){

}

function handleFilter(event){
    event.target.selected = true;
    var filterObj = {'sentiment':{}};
    var filterString = "";
    if(event.target.getAttribute("class")!=null){
        if(event.target.getAttribute("class").indexOf("btn") == -1){
            filterString = event.target.parentElement.dataset.edit;
        }else{
            filterString = event.target.dataset.edit;
        }
    }else{
        filterString = event.currentTarget.dataset.edit;
    }

    var filterStringTokens = filterString.split(" ");
    if(filterStringTokens[0] == "sentiment"){
        if(filterStringTokens[1] == "removeFilter"){
            filterObj["sentiment"]["data"] = [];
        }else{
            filterObj["sentiment"]["data"] = filterStringTokens.slice(1, filterStringTokens.length);
        }
    }

    chartData = processChartData(filterObj);
    setTimeout(update, 1000, chart.update({
        series: [{
            data: chartData,
            color: 'rgba(83, 83, 223, 0.7)',
            name: 'Amazon Fashion'
        }]
    }));

}

function update(){

}

function unselectByClick(){
    var points = this.getSelectedPoints();
    if (points.length > 0) {
        Highcharts.each(points, function (point) {
            point.select(false);
        });
    }
}