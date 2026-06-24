import os

for i in range(1, 29):
    num = f'{i:02d}'
    path = f'pr/{num}.html'
    if not os.path.exists(path):
        print(f'Не найден: {path}')
        continue
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    old = """    <script>
        document.querySelectorAll('[data-katex]').forEach(el => {
            katex.render(el.dataset.katex, el, { throwOnError: false });
        });
        function toggle(id) {
            var el = document.getElementById(id);
            el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
        }
    </script>"""
    
    new = """    <script>
        document.querySelectorAll('[data-katex]').forEach(el => {
            katex.render(el.dataset.katex, el, { throwOnError: false });
        });
        function toggle(id) {
            var el = document.getElementById(id);
            el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'block' : 'none';
        }
        if (window.location.search.includes('nosol=1')) {
            document.querySelectorAll('.solution-block, .answer').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.btn-outline-gold').forEach(el => el.style.display = 'none');
        }
    </script>"""
    
    if old in html:
        html = html.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Обновлён: {path}')
    else:
        print(f'Пропущен (не найдена замена): {path}')

print('Готово!')
