window.onload = function(){
    getMetadata();
    initPlot();
}
$(document).ready(function() {
    $('.mdb-select').materialSelect();
});


var chart;
var currentSelectedSentiment = null
var currentSelectedCategory = null
var filterObj = {'sentiment':{},'rating':{},'cost':{},'category':{}};

function initPlot(){
    chart = new Highcharts.chart({
        chart: {
            renderTo: 'mainPlot',
            type: 'scatter',
            height: 450
        },
        exporting: {
            enabled: false
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
                backgroundColor: 'transparent',
                events: {
                    click: unselectByClick,
                },
                height: 450
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
                    text: 'Average Sentiment',
                    style:{
                        color: "#ffffff"
                    }
                },
                startOnTick: false,
                gridLineWidth: false,
                showFirstLabel: true,
                showLastLabel: true,
                lineColor: "#ffffff",
                labels:{
                    style:{
                        color: "#ffffff"
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Average Rating',
                    style:{
                        color: "#ffffff"
                    }
                },
                gridLineWidth: false,
                showFirstLabel: false,
                showLastLabel: false,
                lineColor: "#ffffff",
                labels:{
                    style:{
                        color: "#ffffff"
                    }
                }
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
                                fillColor: 'rgb(255, 26, 117,0.7)',
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
                        pointFormat: 'Title: {point.title} <br/> Sentiment Score: {point.sentimentValue} <br/> Rating: {point.rating}<br/> Cost(USD): {point.price}'
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
                                var modal = document.getElementById("myModal");
                                modal.style.display = "block";
                                var modaljq = $('#myModal');
                                var span = document.getElementsByClassName("close")[0];
                                var spn3 = modaljq.find('.col-md-3');
                                if(e.target.options.new_image == "null")
                                    spn3.empty().append('<img src="'+ e.target.options.image[0] +'" height="64px" width="64px">');
                                else
                                    spn3.empty().append('<img src="'+ e.target.options.new_image +'" height="250px" width="150px">');
                                modaljq.find('.modal-header h4').text(e.target.options.title);
                                modaljq.find('.card button').unbind();
                                modaljq.find('.card button').click(function() {
                                    window.open("https://www.amazon.com/dp/"+e.target.options.asin+"/");
                                });
                                modaljq.find('.card h4').text(e.target.options.title);
                                modaljq.find('.card .price').text(e.target.options.price);
                                modaljq.find('.card #brand').text("Brand - " + e.target.options.brand);

                                // var text = "";
                                // for (var i=0; i< e.target.options.reviews.length;i++){
                                //     text = e.target.options.reviews[i]['reviewText'] + " "+ text ;
                                // }
                                // console.log(text);
                                var text = e.target.options.wordcloud;
                                var lines = text.split(/[,\. ]+/g);
                                var data = Highcharts.reduce(lines, function (arr, word) {
                                    var obj = Highcharts.find(arr, function (obj) {
                                        return obj.name === word;
                                    });
                                    if (obj) {
                                        obj.weight += 1;
                                    } else {
                                        arr.push({
                                            name: word,
                                            weight: 1
                                        });
                                    }
                                    return arr;
                                }, []);

                                data.sort(function(a,b){
                                    if(a['weight'] > b['weight']) return -1;
                                    if(a['weight'] < b['weight']) return 1;
                                    return 0;
                                });



                                data = data.slice(0, 40);

                                // Highcharts.chart('worcloud-container', {
                                //     series: [{
                                //         type: 'wordcloud',
                                //         data: data,
                                //         name: 'Occurrences'
                                //     }],
                                //     title: {
                                //         text: 'Wordcloud of the product reviews'
                                //     }
                                // });
                                var makeScale = function (domain, range) {
                                    var minDomain = domain[0];
                                    var maxDomain = domain[1];
                                    var rangeStart = range[0];
                                    var rangeEnd = range[1];

                                    return (value) => {
                                        return rangeStart + (rangeEnd - rangeStart) * ((value - minDomain) / (maxDomain - minDomain));
                                    }
                                };
                                /**
                                 * Find min and max weight using reduce on data array
                                 */
                                var minWeight = data.reduce((min, word) =>
                                        (word.weight < min ? word.weight : min),
                                    data[0].weight
                                );
                                var maxWeight = data.reduce((max, word) =>
                                        (word.weight > max ? word.weight : max),
                                    data[0].weight
                                );
                                var scale = makeScale([minWeight, maxWeight], [0.3, 1]);
                                /**
                                 * creating a new, scaled data array
                                 */
                                var scaledData = data.map(word =>
                                    ({ name: word.name, weight: word.weight, color: `rgb(0,0,0,${scale(word.weight)})` })
                                );

                                Highcharts.chart('worcloud-container', {
                                    series: [{
                                        type: 'wordcloud',
                                        data: scaledData,
                                        rotation: {
                                            from: 0,
                                            to: 0,
                                        },
                                        minFontSize: 7,
                                        style: {
                                            fontFamily: 'Arial',
                                        },
                                        name: 'Occurrences'
                                    }],
                                    exporting: {
                                        enabled: false
                                    },
                                    chart:{
                                        events: {
                                            click: null,
                                        }
                                    },
                                    title: {
                                        text: 'Wordcloud of the product review',
                                        style :{
                                            color:'#000000',
                                            fontWeight: "bold"
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            },
            exporting: {
                enabled: false
            },
            series: [{
                data: processChartData(null),
                color: 'rgb(255, 26, 117,0.7)',
                name: 'Amazon Fashion'
            }]
        })

    }, 3000);

}

//handle the click function to show the modal
function handleClick(){

}

function removeFilter(event){
    //reset object to initial state
    filterObj = null;
    if(currentSelectedSentiment!=null){
    currentSelectedSentiment.style.background = "white";
    }
    currentSelectedSentiment = null;
    chartData = processChartData(filterObj);
    setTimeout(update, 1000, chart.update({
        series: [{
            data: chartData,
            color: 'rgba(255,26,117,0.7)',
            name: 'Amazon Fashion'
        }]
    }));
    //initialize filter obj to empty k-v pairs again
    filterObj = {'sentiment':{},'rating':{},'cost':{}};

}

function handleFilter(event){
    if(event){
        var filterString = "";
        if(event.target == "ratingSlider"){
            filterString = "ratings " + event.data;
        }
        else if(event.target == "costSlider"){
            filterString = "cost " + event.data;
        }
        else{
            if(event.target.getAttribute("class")!=null){
                if(event.target.getAttribute("class").indexOf("btn") == -1){
                    if(event.target.getAttribute("class").indexOf("ratings") == 0){
                        filterString = event.target.getAttribute("class");
                    }else{
                        filterString = event.target.parentElement.dataset.edit;
                    }
                }else{
                    filterString = event.target.dataset.edit;
                }
            }else{
                filterString = event.currentTarget.dataset.edit;
            }
        }


        var filterStringTokens = filterString.split(" ");
        if(filterStringTokens[0] == "sentiment"){

            //Handle selected css for sentiment buttons
            if(currentSelectedSentiment!=null){
                currentSelectedSentiment.style.background="white";
            }
            if(event.target.parentNode != document.getElementById("sentimentFilters")){
                event.target.parentNode.style.background = "#c9e60e";
                currentSelectedSentiment = event.target.parentNode;
            }
            else{
                event.target.style.background = "#c9e60e";
                currentSelectedSentiment = event.target;
            }

            if(filterStringTokens[1] == "removeFilter"){
                filterObj["sentiment"]["data"] = [];
            }else{
                filterObj["sentiment"]["data"] = filterStringTokens.slice(1, filterStringTokens.length);
            }
        }
        else if(filterStringTokens[0] == 'ratings'){
            if(filterStringTokens[1] == "removeFilter"){
                filterObj["rating"]["data"] = [];
                slider.setValue(5);
            }else{
                filterObj["rating"]["data"] = filterStringTokens[1];
            }
            // var sliderVal = document.getElementById("sliderVal");
            // sliderVal.innerHTML="Max Rating: "+event.target.value;
        }

        else if(filterStringTokens[0] == 'cost'){
            if(filterStringTokens[1] == "removeFilter"){
                filterObj['cost']['data'] = [];
                costSlider.setValue(maxCost)
            }else{
                filterObj['cost']['data'] = filterStringTokens[1];
            }
        }

        else if(filterStringTokens[0] == "category") {

            // Handle selected css for sentiment buttons
            if (currentSelectedCategory != null) {
                currentSelectedCategory.style.background = "white";
            }
            if (event.target.parentNode != document.getElementById("span12")) {
                event.target.parentNode.style.background = "#c9e60e";
                currentSelectedCategory = event.target.parentNode;
            } else {
                event.target.style.background = "#c9e60e";
                currentSelectedCategory = event.target;
            }


            if (filterStringTokens[1] == "removeFilter") {
                filterObj["category"]["data"] = [];
            } else {
                filterObj["category"]["data"] = filterStringTokens[1];

            }
        }
        chartData = processChartData(filterObj);
        setTimeout(update, 1000, chart.update({
            series: [{
                data: chartData,
                color: 'rgb(255, 26, 117,0.7)',
                name: 'Amazon Fashion'
            }]
        }));
    }
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