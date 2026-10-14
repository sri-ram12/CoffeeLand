import re, json

with open(r'C:\Users\chand\.gemini\antigravity-ide\brain\808cf776-cb4b-4b9f-808c-e575cde7395b\.system_generated\steps\271\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

print("File length:", len(text))

# Search for name and address patterns
print("\n--- ADDRESS & STRINGS ---")
for line in text.splitlines():
    if any(k in line.lower() for k in ['tagarapuvalasa', 'visakhapatnam', 'vizag', 'andhra', 'bheemunipatnam', 'road', 'near']):
        # Find readable chunks
        chunks = re.findall(r'[A-Za-z0-9\s,\.\-\+\(\)&]{8,100}', line)
        for c in chunks:
            c = c.strip()
            if any(k in c.lower() for k in ['tagarapuvalasa', 'visakhapatnam', 'vizag', 'andhra', 'coffeeland']):
                print("FOUND:", c)

# Search for phone numbers
phones = re.findall(r'(?:\+91[\s\-]?)?[6-9]\d{4}[\s\-]?\d{5}', text)
print("\nPhones found:", list(set(phones)))

# Search for Google photos
photos = re.findall(r'https://lh[3-6]\.googleusercontent\.com/p/[A-Za-z0-9_\-]+', text)
unique_photos = list(dict.fromkeys(photos))
print(f"\nUnique Google Photos: {len(unique_photos)}")
for p in unique_photos[:10]:
    print("Photo:", p)

# Search for ratings
ratings = re.findall(r'(\d\.\d)\s*stars?|\"(\d\.\d)\",\s*\[null,\s*\"(\d+)\"', text)
print("\nRatings found:", ratings[:5])
