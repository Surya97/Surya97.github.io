import gzip
import json
from tqdm import tqdm

def parse(path):
  g = gzip.open(path, 'r')
  for l in tqdm(g):
    yield json.loads(l)

# with open('data copy.json', 'r') as f:
#     data = json.load(f)
data = list(parse("meta_AMAZON_FASHION.json.gz"))
count = 0
list = []
asin_list = []
for x in tqdm(data):
    if 'asin' in x and 'title' in x and 'image' in x and 'rank' in x and 'description' in x:
        count += 1
        list.append(x)
        asin_list.append(x['asin'])
    if count >= 600:
        break

# with open('data.json', 'w', encoding='utf-8') as f:
#     json.dump(list, f, ensure_ascii=False, indent=4)
#
# with open('data_asin.json', 'w', encoding='utf-8') as f:
#     json.dump(asin_list, f, ensure_ascii=False, indent=4)




