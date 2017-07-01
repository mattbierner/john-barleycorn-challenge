import re
import json

with open('text.txt', 'r') as f:
    contents = f.read()

found = re.findall(r'\b\S+\b', contents)

indicies = []

for i in xrange(len(found)):
    current = found[i]
    if re.search('barleycorn', current, re.IGNORECASE):
        indicies.append(i - 1)


with open('data.json', 'w') as f:
    json.dump({
        'total_length': len(found),
        'indicies': indicies
    }, f, ensure_ascii=False,  indent=4, separators=(',', ': ')),
