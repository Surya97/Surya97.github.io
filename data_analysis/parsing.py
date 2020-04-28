import gzip
import json
from tqdm import tqdm
import pickle

def parse(path):
  g = gzip.open(path, 'r')
  for l in tqdm(g):
    yield json.loads(l)

# with open('data copy.json', 'r') as f:
#     data = json.load(f)
file = open('2018_asins.p', 'rb')
data_asins = pickle.load(file)
data = list(parse("meta_AMAZON_FASHION.json.gz"))
count = 0
list_v = []
asin_list = set()
for x in tqdm(reversed(data)):
    if 'asin' in x and 'title' in x and 'image' in x and 'rank' in x and 'description' in x and 'price' in x and 'brand' in x and x['asin'] in data_asins:
        count += 1
        res = {key: x[key] for key in x.keys()
               & {'asin', 'title','image','rank','description','price','brand'}}
        list_v.append(res)
        asin_list.add(x['asin'])
    if count >= 600:
        break
asin_vals = list(asin_list)
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(list_v, f, ensure_ascii=False, indent=4)

with open('data_asin.json', 'w', encoding='utf-8') as f:
    json.dump(asin_vals, f, ensure_ascii=False, indent=4)




