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
        pass # Ignore binary files or unreadable files

def process_directory(directory, replacements, extensions=('.tsx', '.ts', '.js', '.json', '.html', '.py', '.css')):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.next' in root or '.git' in root or 'venv' in root:
            continue
        for file in files:
            if file.endswith(extensions):
                filepath = os.path.join(root, file)
                replace_in_file(filepath, replacements)

if __name__ == "__main__":
    replacements = [
        ("KADY", "KADY"),
        ("KADY", "KADY"),
        ("KADY", "KADY"),
        ("KADY", "KADY"),
        ("kady", "kady"),
        ("kady", "kady"),
        ("KADY", "KADY"),
        ("KADY", "KADY"),
        ("KADY", "KADY")
    ]
    
    base_dir = r"d:\Projects\ncf-sports-recommender"
    
    frontend_dir = os.path.join(base_dir, "frontend")
    backend_dir = os.path.join(base_dir, "backend")
    
    print("Processing frontend...")
    process_directory(frontend_dir, replacements)
    
    print("Processing backend...")
    process_directory(backend_dir, replacements)
    
    print("Done!")
