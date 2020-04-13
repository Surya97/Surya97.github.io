let reviewData = [];
let metadata = [];
let data = [];
let chartData = [];
let initialChartData = [];

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
            }
            chartData.push(temp_object);
        });
        initialChartData = Object.assign([], chartData);

    }else{
        // iterate through the initialChartData and add to the filterData if the dataElement is passed through all filters
        filterData = [];
        initialChartData.forEach(function(dataElement){
            var flag = true;
            for(var filterProp in filter){
                if(filterProp == 'sentiment' ){
                    if(filter[filterProp]['data'].length!=0){
                        let low = filter[filterProp]['data'][0];
                        let high = filter[filterProp]['data'][1];
                        if(dataElement['x'] < parseFloat(low) || dataElement['x'] >= parseFloat(high)){
                            flag = false;
                            break;
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

