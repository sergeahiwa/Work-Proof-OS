import os
import glob
import re
import json

files_to_scan = sorted(glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True))

inventory = []

# Exclude non-UI code files like scripts or pure logic if no UI strings, but scan everything first
print(f"Total files to scan: {len(files_to_scan)}")

# Regex patterns
jsx_text_pattern = re.compile(r'>\s*([^<>{}\n\t][^<>{}]*?)\s*<')
string_literal_pattern = re.compile(r'''(?:title|label|placeholder|description|heading|subheading|text|name|comment|action|reason|role|validatorName|validatorRole|message|tooltip|alert|header|subtitle|heading|button|tab|badge)\s*:\s*["'`\n]([^"'`\n]{2,})["'`\n]''')
alert_pattern = re.compile(r'''alert\s*\(\s*["'`\n]([^"'`\n]+)["'`\n]\s*\)''')
placeholder_pattern = re.compile(r'''placeholder\s*=\s*["'`\n]([^"'`\n]+)["'`\n]''')
title_attr_pattern = re.compile(r'''(?:title|alt|aria-label)\s*=\s*["'`\n]([^"'`\n]+)["'`\n]''')

entry_id = 1

for filepath in files_to_scan:
    # Skip non-UI scripts/verification scripts if pure dev tools, but let's check
    rel_path = filepath.replace('\\', '/')
    filename = os.path.basename(filepath)
    component_name = filename.split('.')[0]
    
    # Determine Screen / Module
    if 'src/pages/' in rel_path:
        screen = rel_path.split('src/pages/')[1].split('.')[0]
    elif 'src/components/intelligence/' in rel_path:
        screen = 'Intelligence / RIL'
    elif 'src/components/ui/' in rel_path:
        screen = 'UI Core Components'
    elif 'src/components/' in rel_path:
        screen = 'Global Components'
    elif 'src/content/' in rel_path:
        screen = 'Global Content Copy'
    elif 'src/data/' in rel_path:
        screen = 'Templates & Mock Data'
    else:
        screen = 'System / Core'

    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    file_content = "".join(lines)

    # Scan line by line for precise line numbers & context
    for line_idx, line in enumerate(lines, 1):
        line_str = line.strip()
        
        # Ignore import statements, standard console.log, types, ts-ignore, svg paths
        if line_str.startswith('import ') or line_str.startswith('export type') or line_str.startswith('interface ') or line_str.startswith('//'):
            continue
        if 'className=' in line_str and not ('>' in line_str or 'title=' in line_str or 'placeholder=' in line_str):
            continue
        if line_str.startswith('path ') or line_str.startswith('d=') or line_str.startswith('<path'):
            continue
        if line_str.startswith('console.error') or line_str.startswith('console.log'):
            continue

        # 1. JSX text between tags >text<
        jsx_matches = jsx_text_pattern.findall(line)
        for text in jsx_matches:
            t = text.strip()
            # Clean up JS expressions or SVG code or punctuation only
            if not t or t.startswith('{') or t.endswith('}') or t in ['/', ':', '-', '|', '•', '+', '—', '&']:
                continue
            if len(t) < 2 and not t.isalnum():
                continue
            # Ignore code words like "React", "lucide-react", CSS classes
            if t in ['div', 'span', 'button', 'p', 'h1', 'h2', 'h3', 'h4', 'input', 'select', 'option']:
                continue

            inventory.append({
                'id': entry_id,
                'file': rel_path,
                'component': component_name,
                'screen': screen,
                'line': line_idx,
                'location': f"Ligne {line_idx} (JSX Text)",
                'text': t
            })
            entry_id += 1

        # 2. String props/object literals like title="...", placeholder="...", label: "..."
        props_matches = string_literal_pattern.findall(line)
        for text in props_matches:
            t = text.strip()
            if not t or t.startswith('{') or len(t) < 2:
                continue
            # Filter out non-French technical keys
            if t in ['text-slate-400', 'bg-surface', 'flex', 'grid', 'px-4', 'py-2', 'utf-8', 'POST', 'GET']:
                continue
            inventory.append({
                'id': entry_id,
                'file': rel_path,
                'component': component_name,
                'screen': screen,
                'line': line_idx,
                'location': f"Ligne {line_idx} (Prop/Literal)",
                'text': t
            })
            entry_id += 1

        # 3. Alert / Placeholder / Title Attr
        alert_matches = alert_pattern.findall(line)
        for t in alert_matches:
            if t.strip():
                inventory.append({
                    'id': entry_id,
                    'file': rel_path,
                    'component': component_name,
                    'screen': screen,
                    'line': line_idx,
                    'location': f"Ligne {line_idx} (Alert/Message)",
                    'text': t.strip()
                })
                entry_id += 1

        ph_matches = placeholder_pattern.findall(line)
        for t in ph_matches:
            if t.strip():
                inventory.append({
                    'id': entry_id,
                    'file': rel_path,
                    'component': component_name,
                    'screen': screen,
                    'line': line_idx,
                    'location': f"Ligne {line_idx} (Placeholder)",
                    'text': t.strip()
                })
                entry_id += 1

print(f"Extracted {len(inventory)} candidate UI text items")
