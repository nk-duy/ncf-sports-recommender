import os

def replace_in_file(filepath, replacements):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for old, new in replacements:
            content = content.replace(old, new)
            
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {filepath}")
    except Exception as e:
        pass 

def process_directory(directory, replacements, extensions=('.tsx', '.ts')):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.next' in root or '.git' in root or 'venv' in root:
            continue
        for file in files:
            if file.endswith(extensions):
                filepath = os.path.join(root, file)
                replace_in_file(filepath, replacements)

if __name__ == "__main__":
    replacements = [
        ("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", "w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16"),
        ("max-w-7xl mx-auto", "w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16") 
    ]
    
    base_dir = r"d:\Projects\ncf-sports-recommender"
    frontend_dir = os.path.join(base_dir, "frontend", "src")
    
    print("Processing frontend to stretch all pages...")
    process_directory(frontend_dir, replacements)
    print("Done!")
