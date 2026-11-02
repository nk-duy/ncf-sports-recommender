#!/usr/bin/env python3
"""
verify-links.py
Automated hook to verify all markdown file links in .claude/, docs/, and root documents.
"""

import os
import re
import sys

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_file_links(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Match file:/// links and relative markdown links [text](path)
    links = re.findall(r'\[([^\]]+)\]\((file:///[^\)]+|[^http][^\)]+)\)', content)
    broken = []

    for text, link in links:
        target = ""
        if link.startswith('file:///'):
            # Convert URI to local path
            clean_uri = link.replace('file:///', '').split('#')[0]
            if os.name == 'nt' and ':' in clean_uri:
                target = os.path.normpath(clean_uri)
            else:
                target = os.path.normpath('/' + clean_uri)
        elif not link.startswith('http') and not link.startswith('#') and not link.startswith('mailto:'):
            clean_rel = link.split('#')[0]
            target = os.path.normpath(os.path.join(os.path.dirname(file_path), clean_rel))

        if target and not os.path.exists(target):
            broken.append((text, link, target))

    return broken

def main():
    print(f"--- [HOOK] Verifying Documentation Links in {ROOT_DIR} ---")
    checked_files = 0
    all_broken = {}

    scan_dirs = ['.claude', 'docs']
    target_files = ['CLAUDE.md', 'AGENTS.md', 'README.md']

    for tf in target_files:
        full_p = os.path.join(ROOT_DIR, tf)
        if os.path.exists(full_p):
            checked_files += 1
            b = check_file_links(full_p)
            if b:
                all_broken[tf] = b

    for sdir in scan_dirs:
        full_sdir = os.path.join(ROOT_DIR, sdir)
        if not os.path.exists(full_sdir):
            continue
        for root, _, files in os.walk(full_sdir):
            for file in files:
                if file.endswith('.md'):
                    fp = os.path.join(root, file)
                    checked_files += 1
                    b = check_file_links(fp)
                    if b:
                        rel = os.path.relpath(fp, ROOT_DIR)
                        all_broken[rel] = b

    print(f"Checked {checked_files} markdown files.")
    if all_broken:
        print(f"⚠️ FOUND {len(all_broken)} FILES WITH BROKEN LINKS:")
        for fn, issues in all_broken.items():
            print(f"\n  File: {fn}")
            for text, link, target in issues:
                print(f"    - Text: '{text}' -> Link: '{link}' (Not found: {target})")
        sys.exit(1)
    else:
        print("✅ 100% of documentation links are valid!")
        sys.exit(0)

if __name__ == '__main__':
    main()
