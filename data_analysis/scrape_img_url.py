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


driver = webdriver.PhantomJS()

path_to_asin_file = r'C:\Users\Tanush\Documents\DV\Repo\Data-Visualization\data_asin.json'

URL = "https://www.amazon.com/dp/"
img_url_dict = dict()
ctr = 0
with open(path_to_asin_file, 'r') as f:
    asins = json.load(f)

    #For each asin pull all img tags
    for asin in asins:
        print(asin)
        #Used selenium to render JS elements as img tags are JS elements and then fected HTML from page 
        driver.get(URL+asin)
        images = driver.find_elements_by_tag_name('img')
        for image in images:
        	#The format for product image url goes like: "https://images-na.ssl-images-amazon.com/images/I/"
        	#Leveraged this pattern to get only product images and not useless stuff like amazon logo etc. 
        	if "https://images-na.ssl-images-amazon.com/images/I/" in str(image.get_attribute('src')):
        	    img_url_dict[asin] = str(image.get_attribute('src'))
        	    print(image.get_attribute('src'))
        	    break
        	else:
        		#If image is unavailable its null -> Make modal to default image in this case
        		img_url_dict[asin] = "null"
        time.sleep(5)


with open('img_url.json', 'w') as fp:
    json.dump(img_url_dict, fp)
        
        





