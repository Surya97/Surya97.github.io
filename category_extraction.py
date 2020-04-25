# -*- coding: utf-8 -*-
"""
Created on Thu Apr 23 17:47:37 2020

@author: kheer
"""

#import urllib.request, json
#import pandas as pd 
#category_list=set()
#with urllib.request.urlopen("https://raw.githubusercontent.com/sindu2296/Data-Visualization/master/data.json") as url:
#    data = json.loads(url.read().decode())
#    for i in range(len(data)):
#        category_list.add(data[0]['rank'])
##        category_list=category_list + data[i]['rank'] + " "
##        #rating_list=rating_list + " "
#print(category_list)
#

'''
Requires:
selenium - pip install
Phantom JS - Install from here: https://phantomjs.org/download.html
             Installation tutorial: windows: https://testguild.com/how-to-install-phantomjs/
                                    mac: https://stackoverflow.com/questions/36993962/installing-phantomjs-on-mac
'''

import json
from selenium import webdriver
import time
from tqdm import tqdm

driver = webdriver.PhantomJS(executable_path='C:/Users/kheer/Downloads/phantomjs-2.1.1-windows/phantomjs-2.1.1-windows/bin/phantomjs')

# path_to_asin_file = r'C:\Users\Tanush\Documents\DV\Repo\Data-Visualization\data_asin.json'
#path_to_asin_file = '../data_asin.json'
path_to_asin_file ='C:/Personal stuff/ASU/ASU 2nd sem/DV/Project/Data-Visualization/data_asin.json'

URL = "https://www.amazon.com/dp/"
cat_url_dict = dict()
#new_list=[]
ctr = 0
count=0
with open(path_to_asin_file, 'r') as f:
    asins = json.load(f)
#asins=['B01HGB7GY8','B01HIWLG6Y']
    # For each asin pull all img tags
    for asin in tqdm(asins):
        new_list=[]
        #cat_url_dict[asin]=[]
        # print(asin)
        # Used selenium to render JS elements as img tags are JS elements and then fected HTML from page
        driver.get(URL + asin)
    #    exists = driver.find_element_by_xpath('//*[@class="a-unordered-list a-horizontal a-size-small"]')
        images = driver.find_elements_by_xpath('//*[@class="a-link-normal a-color-tertiary"]')
        #document.getElementsByClassName("a-breadcrumb")[0].getElementsByClassName("a-link-normal")
    #        find_elements_by_class_name('a-unordered-list a-horizontal a-size-small')
    #        print(images)
        for image in images:
    #        print(images[image])
    #        cat_url_dict[asin] = str(image.get_attribute('href'))
            new_list.append(image.text)
            
    #             The format for product image url goes like: "https://images-na.ssl-images-amazon.com/images/I/"
    #             Leveraged this pattern to get only product images and not useless stuff like amazon logo etc.
    #            if "https://images-na.ssl-images-amazon.com/images/I/" in str(image.get_attribute('href')):
    #                img_url_dict[asin] = str(image.get_attribute('src'))
    #                # print(image.get_attribute('src'))
    #                break
    #            else:
    #                # If image is unavailable its null -> Make modal to default image in this case
    #                img_url_dict[asin] = "null"
    #        time.sleep(5)
        cat_url_dict[asin]=new_list
        if(new_list!=[]):
            count+=1
print(cat_url_dict)
#with open('../img_url.json', 'w+') as fp:
#    json.dump(img_url_dict, fp)