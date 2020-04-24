import json
from tqdm import tqdm
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


def process_wordcloud_data():
    stop_words = set(stopwords.words('english'))
    with open('../data.json', 'r+') as data:
        final_data = json.load(data)

    output_data = []

    for data in tqdm(final_data):
        reviews = data['reviews']
        final_review_sentence = ''
        for review in reviews:
            if 'reviewText' in review:
                word_tokens = word_tokenize(review['reviewText'].lower())
                for word_token in word_tokens:
                    if word_token not in stop_words and word_token.isalpha():
                        final_review_sentence += (word_token + ' ')
        data['wordcloud'] = final_review_sentence

        output_data.append(data)

    with open('../data.json', 'w+') as fp:
        json.dump(output_data, fp)


process_wordcloud_data()

