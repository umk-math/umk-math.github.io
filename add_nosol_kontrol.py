import os

script = '''<script>
    if (window.location.search.includes('nosol=1')) {
        document.querySelectorAll('.solution, .solution-block, .answer, .answer-block, .btn-show').forEach(el => {
            el.style.display = 'none';
        });
    }
</script>
</body>'''

def update_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if '</body>' in html and 'nosol=1' not in html:
        html = html.replace('</body>', script)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'OK: {path}')
    else:
        print(f'SKIP: {path}')

# Входной контроль
update_file('kontrol/vhodnoj.html')

# Текущий контроль
for f in os.listdir('kontrol/current'):
    if f.endswith('.html'):
        update_file(f'kontrol/current/{f}')

# Тематические
for folder in os.listdir('kontrol/thematic'):
    folder_path = f'kontrol/thematic/{folder}'
    if os.path.isdir(folder_path):
        for f in os.listdir(folder_path):
            if f.endswith('.html'):
                update_file(f'{folder_path}/{f}')

# Итоговый
update_file('kontrol/final/bilety.html')

print('Готово!')