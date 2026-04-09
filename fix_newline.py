import os

def fix_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx', '.py', '.css', '.html')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if content.endswith('\\n'):
                    print(f"Fixing {filepath}")
                    content = content[:-2] + '\n'
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)

fix_files(r'c:\Users\tejsh\OneDrive\Desktop\crop-disease-project')
