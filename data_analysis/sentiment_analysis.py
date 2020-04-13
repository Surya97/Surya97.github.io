"""
To run this first download the stanford-corenlp jar

wget https://nlp.stanford.edu/software/stanford-corenlp-full-2018-10-05.zip https://nlp.stanford.edu/software/stanford-english-corenlp-2018-10-05-models.jar

Then, run the following commands
unzip stanford-corenlp-full-2018-10-05.zip
mv stanford-english-corenlp-2018-10-05-models.jar stanford-corenlp-full-2018-10-05

Start the corenlp server

cd stanford-corenlp-full-2018-10-05
java -mx6g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -timeout 5000

Install pycorenlp module which is wrapper for using the corenlp server

pip install pycorenlp
"""


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import json
from tqdm import tqdm


def process_sentiment():
    with open('../review_data.json', 'r+') as file_reviews:
        data = json.load(file_reviews)
    from pycorenlp import StanfordCoreNLP
    nlp = StanfordCoreNLP('http://localhost:9000')

    reviews_fashion_df = pd.DataFrame(columns=['asin', 'overall', 'summary', 'reviewTime', 'sentimentValue', 'sentiment'])

    for review_line in tqdm(data):
        temp = dict()
        if 'reviewText' in review_line:
            for col in list(reviews_fashion_df.columns):
                if col in review_line:
                    temp[col] = review_line[col]
                else:
                    temp[col] = None
            result = nlp.annotate(review_line['reviewText'],
                                  properties={
                                      'annotators': 'sentiment',
                                      'outputFormat': 'json',
                                      'timeout': 5000,
                                  })
            sentiment_score = 0
            sentences = len(result['sentences'])
            for s in result['sentences']:
                sentiment_score += (int(s['sentimentValue']) + 1)

            temp['sentimentValue'] = sentiment_score / sentences

            if temp['sentimentValue'] < 3:
                temp['sentiment'] = 'Negative'
            elif temp['sentimentValue'] > 3:
                temp['sentiment'] = 'Positive'
            else:
                temp['sentiment'] = 'Neutral'

            reviews_fashion_df = reviews_fashion_df.append(temp, ignore_index=True)

    reviews_fashion_df.to_json('../review_sentiment_Data.json', orient='records')


process_sentiment()
