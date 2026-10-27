import urllib.request
import json

def test_recommendations():
    # 1. Test Cross-sell
    body = json.dumps(["9292b489-81b7-4313-9a8a-5c4676d8b121"]).encode("utf-8")
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/recommendations/cross-sell?top_k=8",
        data=body,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        items = json.loads(res.read().decode("utf-8"))

    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print(f"--- Cross-Sell: Total={len(items)} ---")
    imgs = [p.get("image_url") for p in items]
    unique_imgs = set(imgs)
    print(f"Unique images: {len(unique_imgs)}/{len(imgs)}")
    for i, p in enumerate(items, 1):
        print(f"  {i}. {p['name'][:35]} | img: {p['image_url'][:60]}...")

    # 2. Test Main Recommendations
    req2 = urllib.request.Request("http://localhost:8000/api/v1/recommendations/?top_k=12")
    with urllib.request.urlopen(req2) as res2:
        items2 = json.loads(res2.read().decode("utf-8"))

    print(f"\n--- Main Recommendations: Total={len(items2)} ---")
    imgs2 = [p.get("image_url") for p in items2]
    unique_imgs2 = set(imgs2)
    print(f"Unique images: {len(unique_imgs2)}/{len(imgs2)}")
    for i, p in enumerate(items2, 1):
        print(f"  {i}. {p['name'][:35]} | img: {p['image_url'][:60]}...")

if __name__ == "__main__":
    test_recommendations()
