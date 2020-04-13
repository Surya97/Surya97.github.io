import gzip
import json
from tqdm import tqdm
import pickle

def parse(path):
  g = gzip.open(path, 'r')
  for l in tqdm(g):
    yield json.loads(l)

asins_set = set()
List_repeated = set()
with open('data_asin.json', 'r') as f:
    asins = json.load(f)
    for x in asins:
        if x in asins_set:
            List_repeated.add(x)
        else:
            asins_set.add(x)

# print(len(asins_set))
# print(List_repeated)
# pickle.dump( List_repeated, open( "list_repeated.p", "wb" ) )
# print(len(List_repeated))

data = list(parse("AMAZON_FASHION.json.gz"))
final_review_data = []
for obj in tqdm(data):
    if obj['asin'] in asins_set:
        final_review_data.append(obj)

with open('review_data.json', 'w', encoding='utf-8') as f:
    json.dump(final_review_data, f, ensure_ascii=False, indent=4)
