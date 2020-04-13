import json
import gzip
import time

required_keys = ["reviewerID","asin","reviewText"] # Keys to parse in Parse keys

#Paths t0 requrired files by parse_keys and parse_unique
books_json_gz_path = "D:\\Downloads\\reviews_Books_5.json.gz"
books_meta_gz_path = "D:\\Downloads\\meta_Books.json.gz"
parsed_file_path = "D:\\Downloads\\Parsed.json"
unique_categories_file_path = "D:\\Downloads\\Categories.txt"

#creates a file with the keys you want specified by required keys from a json file
def parse_keys(path):
  ctr = 0
  g = gzip.open(path, 'r')
  for l in g:
    temp = dict()
    obj = eval(l)
    for key in required_keys:
       temp[key] = obj[key] 
    yield json.dumps(temp)
    ctr = ctr+1
    if ctr%1000000 == 0:
    	print(ctr," Reviews Parsed!")
    
#creates a text file with unique words from reviews 
def parse_unique(path, output_file):
  g = gzip.open(path, 'r')
  temp = set()
  ctr = 0
  for l in g:
    ctr = ctr+1 
    try:
        categories = eval(l)["category"]
       	for category in categories:
       		temp.add(category)
    except:
        continue 
    if ctr%1000000 == 0:
    	print(ctr," Products Parsed!")
  output_file.writelines("%s\n" % category for category in temp)

#get Review data - for making words cloud 

'''
def parse(path):
  g = gzip.open(path, 'r')
  ctr = 0
  for l in g:
    ctr =ctr + 1
    if ctr%100 == 0:
        yield eval(l)["reviewText"]

f = open("D:\\Downloads\\reviews.txt", 'w')
for l in parse("D:\\Downloads\\reviews_Books_5.json.gz"):
  f.write(l + '\n')
'''

f_reviews = open(parsed_file_path, 'w')
f_unique_categories = open(unique_categories_file_path, 'w')

for l in parse_keys(books_json_gz_path):
  f_reviews.write(l + '\n')

parse_unique(books_meta_gz_path, f_unique_categories)


