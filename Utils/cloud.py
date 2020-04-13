from wordcloud import WordCloud, STOPWORDS
import matplotlib.pyplot as plt

'''
Gives memory error when all the reviews are used on my computer with 16GB of ram. 
Shrink the number of reviews by taking one in 50 or 100. 
'''

stopwords = set(STOPWORDS)

def show_wordcloud(data, title = None):
    wordcloud = WordCloud(
        background_color='white',
        stopwords=stopwords,
        max_words=200,
        max_font_size=40, 
        scale=3,
        random_state=1 # chosen at random by flipping a coin; it was heads
    ).generate(str(data))

    fig = plt.figure(1, figsize=(12, 12))
    plt.axis('off')
    if title: 
        fig.suptitle(title, fontsize=20)
        fig.subplots_adjust(top=2.3)

    plt.imshow(wordcloud)
    plt.show()





#Read the corpus of reviews
corpus = open("D:\\Downloads\\reviews.txt", 'r').read()
print("Read Corpus")

#convert corpus to lower case
corpus = corpus.lower()
print("Corpus to Lower case done")

print("Drawing WordCloud")


show_wordcloud(corpus)