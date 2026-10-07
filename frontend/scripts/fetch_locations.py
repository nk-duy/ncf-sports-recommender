import urllib.request
import json
import os

try:
    print("Fetching data from provinces.open-api.vn...")
    url = "https://provinces.open-api.vn/api/?depth=3"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    
    locations = []
    for prov in data:
        wards = []
        for dist in prov.get('districts', []):
            for ward in dist.get('wards', []):
                wards.append(f"{ward['name']} ({dist['name']})")
        
        locations.append({
            "province": prov['name'],
            "wards": wards
        })
    
    out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'shared', 'data')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'locations.json')
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(locations, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully wrote {len(locations)} provinces to {out_path}")
except Exception as e:
    print(f"Error: {e}")
