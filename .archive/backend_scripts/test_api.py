import urllib.request
import json

def fetch_api():
    url = 'http://localhost:8000/api/v1/products?sport_type=D%C3%A3%20ngo%E1%BA%A1i'
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        for p in data:
            print(p.get("name"))

if __name__ == '__main__':
    fetch_api()
