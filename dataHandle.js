let reviewData = [];
let metadata = [];
let data = [];
let chartData = [];
let initialChartData = [];
let minCost = 1000000;
let maxCost = 0;

function getMetadata(){
    d3.json("data.json").then(function(data){
       metadata = data;
        getReviewData();
    });
}

function getReviewData(){
    d3.json("review_sentiment_Data.json").then(function(review_data){
        reviewData = review_data;
        initData();
    });
}

function initData(){
    metadata.forEach(function(metadataElement){
        metadata_asin = metadataElement['asin'];
        average_sentiment_score = 0.0;
        average_rating = 0;
        count = 0;
        reviewData.forEach(function(reviewElement){
           if(metadata_asin == reviewElement['asin']){
                average_sentiment_score += reviewElement['sentimentValue'];
                average_rating += parseFloat(reviewElement['overall']);
                count += 1;


           }
        });
        if(count > 0){
            metadataElement['sentimentValue'] = average_sentiment_score/count;
            metadataElement['rating'] = average_rating/count;
            if(metadataElement['sentimentValue'] < 3){
                metadataElement['sentiment'] = 'Negative';
            }else if(metadataElement['sentimentValue'] > 3){
                metadataElement['sentiment'] = 'Positive';
            }else{
                metadataElement['sentiment'] = 'Neutral';
            }
            data.push(metadataElement);
        }
    });

}

function processChartData(filter) {
    
        if(filter == null){

        //move slider and emoticons to inital state  --> is done when page refreshes or is called from remove filters button's event handler    
        // var sliderVal = document.getElementById("sliderVal");
        // sliderVal.innerHTML="Max Rating: 5";
        // document.getElementById("myRange").value = 5;

        data.forEach(function(dataElement){
            temp_object = {};
            for(var prop in dataElement){
                if(dataElement.hasOwnProperty(prop)){
                    if(prop == 'sentimentValue'){
                        temp_object['x'] = parseFloat(dataElement[prop]);
                        temp_object['sentimentValue'] = parseFloat(dataElement[prop]).toPrecision(3);
                    }else if(prop == 'rating'){
                        temp_object['y'] = parseFloat(dataElement[prop]);
                        temp_object['rating'] = parseFloat(dataElement[prop]).toPrecision(3);
                    }else{
                        temp_object[prop] = dataElement[prop];
                    }
                }
                if(temp_object['price']) {
                    temp = temp_object['price'].split('-')[0]
                    price = parseFloat(temp.slice(1, temp.length))
                    if (price > maxCost) {
                        maxCost = price;
                    }
                    if (price < minCost) {
                        minCost = price;
                    }
                }
            }

            chartData.push(temp_object);
        });
        initialChartData = Object.assign([], chartData);
        //initialize cost slider
        costSlider.setAttribute("min",minCost)
        costSlider.setAttribute("max",maxCost)
        costSlider.setAttribute("value",maxCost)
        costSlider.refresh()
            costSlider.on("slideStop", function(value){
                let costChangeEvent = {};
                costChangeEvent['target'] = "costSlider";
                costChangeEvent['data'] = value;
                handleFilter(costChangeEvent);
            });


        

    }else{
        // iterate through the initialChartData and add to the filterData if the dataElement is passed through all filters
        filterData = [];
        initialChartData.forEach(function(dataElement){
            var flag = false;
            for(var filterProp in filter){
                if(filterProp == 'sentiment' && filter[filterProp]['data']){
                    flag=true;
                    if(filter[filterProp]['data'].length!=0){
                        let low = filter[filterProp]['data'][0];
                        let high = filter[filterProp]['data'][1];

                        if(dataElement['x'] < parseFloat(low) || dataElement['x'] > parseFloat(high)){
                            flag = false;
                            break;
                        }

                    }
                }
                
                if(filterProp == 'rating'){
                    if(filter[filterProp]['data']){
                        flag=true;
                        let rating = filter[filterProp]['data'];
                        if(dataElement['y'] > parseFloat(rating)){
                            flag = false;
                            break;
                        }
                    }
                }

                if(filterProp == 'cost'){

                    if(filter[filterProp]['data']){
                        flag=true;
                        let cost = filter[filterProp]['data'];
                        dataElementCost = dataElement['price'].split("-")[0];
                        if(parseFloat(dataElementCost.slice(1,dataElementCost.length)) > parseFloat(cost)){
                            flag = false;
                            break;
                        }
                    }
                }
                if(filterProp == 'category') {
                    if (filter[filterProp]['data']) {
                        if (filter[filterProp]['data'].length != 0) {
                            flag = false;
                            let category = filter[filterProp]['data'];
                            if (dataElement['category'] == category) {
                                flag = true;
                            }
                        } else {
                            flag = true;
                        }
                    }
                }
            }
            if(flag == true){
                filterData.push(dataElement);
            }
        });
        chartData = filterData;
    }
    return chartData;
}

