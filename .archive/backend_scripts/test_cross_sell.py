import urllib.request
import json

def test():
    data = json.dumps(["5d191316-1473-4ae4-941d-493bb39f909c"]).encode("utf-8")
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/recommendations/cross-sell?top_k=8",
        data=data,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        items = json.loads(res.read().decode("utf-8"))
    
    print(f"Total returned: {len(items)}")
    images = []
    names = []
    for i, p in enumerate(items, 1):
        print(f"{i}. {p.get('name')} | {p.get('image_url')}")
        images.append(p.get("image_url"))
        names.append(p.get("name"))

    dup_images = len(images) - len(set(images))
    dup_names = len(names) - len(set(names))
    print(f"Duplicate images: {dup_images}")
    print(f"Duplicate names: {dup_names}")

if __name__ == "__main__":
    test()
