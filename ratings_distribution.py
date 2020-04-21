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
l=[]
with urllib.request.urlopen("https://raw.githubusercontent.com/sindu2296/Data-Visualization/master/review_sentiment_Data.json") as url:
    data = json.loads(url.read().decode())
    #print(data[0]['overall'])
    for i in range(len(data)):
        rating_list=rating_list + str(data[i]['overall']) + " "
        #rating_list=rating_list + " "
    for i in range(len(data)):
        a=data[i]['reviewTime'].split(",")[1]
        l.append(int(a))
    
from collections import defaultdict
#rating_list = 'spam spam spam spam spam spam eggs spam'.split()
rating_list = rating_list.split()
rating_count = defaultdict(int) # default value of int is 0
year_rating = defaultdict(int)
for rating in rating_list:
    rating_count[rating] += 1 # increment element's value by 1
    
for i in range(len(l)):
    year_rating[l[i]]+=1
    
print(year_rating)

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

#print(year_rating[2013])

df = pd.DataFrame({
    'ratings': [year_rating[2003],year_rating[2004],year_rating[2005], year_rating[2006], year_rating[2007], year_rating[2008], year_rating[2009], year_rating[2010], year_rating[2011], year_rating[2012], year_rating[2013], year_rating[2014], year_rating[2015], year_rating[2016], year_rating[2017], year_rating[2018]],
}, index=pd.date_range(start=pd.datetime(2003, 1, 1), periods=16, freq='A'))
ax = df.plot.area(y='ratings')


