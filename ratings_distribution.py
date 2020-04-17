# -*- coding: utf-8 -*-
"""
Created on Thu Apr 16 21:33:50 2020

@author: kheer
"""

#import urllib, json
#url = "https://raw.githubusercontent.com/sindu2296/Data-Visualization/master/review_sentiment_Data.json"
#response = urllib.urlopen(url)
#data = json.loads(response.read())
#print(data)

import urllib.request, json
import pandas as pd 
rating_list = ""
with urllib.request.urlopen("https://raw.githubusercontent.com/sindu2296/Data-Visualization/master/review_sentiment_Data.json") as url:
    data = json.loads(url.read().decode())
    #print(data[0]['overall'])
    for i in range(len(data)):
        rating_list=rating_list + str(data[i]['overall']) + " "
        #rating_list=rating_list + " "
    
    
from collections import defaultdict
#rating_list = 'spam spam spam spam spam spam eggs spam'.split()
rating_list = rating_list.split()
rating_count = defaultdict(int) # default value of int is 0
for rating in rating_list:
    rating_count[rating] += 1 # increment element's value by 1
    
#df = pd.DataFrame()

import matplotlib.pyplot as plt
fig = plt.figure()

ax = fig.add_axes([0,0,1,1])
langs = [1,2,3,4,5]
students = [rating_count['1.0'],rating_count['2.0'],rating_count['3.0'],rating_count['4.0'],rating_count['5.0']]
ax.bar(langs,students)
plt.title("Ratings Distribution")
plt.xlabel("Rating")
plt.ylabel("Count")
plt.show()
