import json

img_data = {}
with open('img_url.json', 'r') as f:
    img_data = json.load(f)
data =[]
with open('data.json', 'r') as f:
    data = json.load(f)
    for obj in data:
        obj['new_image'] = img_data[obj['asin']]
        print(obj)

    print(len(data))
with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
