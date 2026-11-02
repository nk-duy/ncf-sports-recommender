#!/usr/bin/env python3
"""
format-check.py
Lightweight automated hook to verify JSON syntax and Python compilation in project.
"""

import os
import sys
import json
import py_compile

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_json_files():
    json_targets = [
        os.path.join(ROOT_DIR, '.claude', 'settings.json'),
        os.path.join(ROOT_DIR, 'frontend', 'package.json'),
        os.path.join(ROOT_DIR, 'frontend', 'tsconfig.json')
    ]
    errors = []
    for jt in json_targets:
        if os.path.exists(jt):
            try:
                with open(jt, 'r', encoding='utf-8') as f:
                    json.load(f)
            except Exception as e:
                errors.append(f"Invalid JSON in {jt}: {e}")
    return errors

def check_python_syntax():
    py_dir = os.path.join(ROOT_DIR, 'backend', 'app')
    errors = []
    for root, _, files in os.walk(py_dir):
        for f in files:
            if f.endswith('.py'):
                fp = os.path.join(root, f)
                try:
                    py_compile.compile(fp, doraise=True)
                except py_compile.PyCompileError as e:
                    errors.append(str(e))
    return errors

def main():
    print("--- [HOOK] Running Fast Format & Syntax Check ---")
    j_errs = check_json_files()
    p_errs = check_python_syntax()

    all_errs = j_errs + p_errs
    if all_errs:
        print(f"❌ Syntax issues found ({len(all_errs)}):")
        for err in all_errs:
            print("  -", err)
        sys.exit(1)
    else:
        print("✅ Core configuration JSON and Backend Python syntax are 100% valid!")
        sys.exit(0)

if __name__ == '__main__':
    main()
