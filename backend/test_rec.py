import asyncio
import aiohttp

async def main():
    try:
        async with aiohttp.ClientSession() as session:
            print("Sending request to /api/v1/recommendations/?top_k=4")
            async with session.get('http://localhost:8000/api/v1/recommendations/?top_k=4', timeout=5) as response:
                print(f"Status: {response.status}")
                text = await response.text()
                print(f"Response: {text}")
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(main())
