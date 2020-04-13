import pickle
import json

List_repeated = pickle.load( open( "list_repeated.p", "rb" ) )
final_data = []
existing_set = set()
with open('data.json', 'r') as f:
    data = json.load(f)
    for obj in data:
        if obj['asin'] in List_repeated and obj['asin'] in existing_set:
            pass
        else:
            final_data.append(obj)
            if obj['asin'] in List_repeated:
                existing_set.add(obj['asin'])

with open('data.json', 'w', encoding='utf-8') as f:
    json.dump(final_data, f, ensure_ascii=False, indent=4)
