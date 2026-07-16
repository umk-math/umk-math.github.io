(function() {
    'use strict';
console.log('CURRICULUM is', typeof CURRICULUM, CURRICULUM);
    // Безопасное чтение данных из curriculum.js
    var C = (typeof CURRICULUM !== 'undefined') ? CURRICULUM : null;
    if (!C) {
        document.body.innerHTML = '<div style="color:#ff6b6b;text-align:center;padding:40px;">Ошибка загрузки данных раздела. Пожалуйста, обновите страницу.</div>';
        return;
    }

    var modules = C.modules;
    var formulas = C.formulas;
    var controlPoints = C.controlPoints;

    // ─── Безопасный localStorage ───────────────────────────────
    function safeGet(key, fallback) {
        try { var val = localStorage.getItem(key); return val !== null ? val : fallback; }
        catch (e) { return fallback; }
    }
    function safeSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* silently fail */ }
    }

    // ─── Статусы ───────────────────────────────────────────────
    function getModuleStatus(id) { return safeGet('module_status_' + id, 'not-ready'); }
    function setModuleStatus(id, s) { safeSet('module_status_' + id, s); }
    function getTopicStatus(modId, idx) { return safeGet('topic_status_' + modId + '_' + idx, 'not-ready'); }
    function setTopicStatus(modId, idx, s) { safeSet('topic_status_' + modId + '_' + idx, s); }

    function cycleModuleStatus(id) {
        var cur = getModuleStatus(id);
        var next = cur === 'not-ready' ? 'review' : cur === 'review' ? 'ready' : 'not-ready';
        setModuleStatus(id, next);
        renderModules();
        updateProgress();
    }

    // ─── Прогресс ──────────────────────────────────────────────
    function getModuleProgress(mod) {
        if (getModuleStatus(mod.id) === 'ready') return 100;
        var completed = mod.topics.filter(function(_, i) { return getTopicStatus(mod.id, i) === 'ready'; }).length;
        return Math.round(completed / mod.topics.length * 100);
    }

    function updateProgress() {
        var totalHours = modules.reduce(function(s, m) { return s + m.hours; }, 0) + C.extraHours[1] + C.extraHours[2];
        var completedHours = modules.reduce(function(s, m) { return s + m.hours * getModuleProgress(m) / 100; }, 0);
        var rounded = Math.round(completedHours);
        document.getElementById('progressBar').style.width = Math.round(completedHours / totalHours * 100) + '%';
        document.getElementById('progressPercent').textContent = Math.round(completedHours / totalHours * 100) + '%';
        document.getElementById('progressDetails').textContent = rounded + ' из ' + totalHours + ' часов освоено';
    }

    // ─── Рендеринг ─────────────────────────────────────────────
    function renderModules() {
        var c1 = document.getElementById('course1');
        var c2 = document.getElementById('course2');
        c1.innerHTML = ''; c2.innerHTML = '';

        modules.forEach(function(mod) {
            var status = getModuleStatus(mod.id);
            var progress = getModuleProgress(mod);
            var statusText = { 'not-ready': '🔴 Не изучено', 'review': '🟡 Повторить', 'ready': '🟢 Освоено' }[status];

            var el = document.createElement('article');
            el.className = 'module-card' + (status === 'ready' ? ' is-ready' : status === 'review' ? ' is-review' : '');
            el.id = 'module-' + mod.id;

            el.innerHTML = '<div class="module-main" data-module-id="' + mod.id + '">' +
                '<div class="module-icon">' + mod.icon + '</div>' +
                '<div class="module-content">' +
                    '<div class="module-title-row"><h3 class="module-title">' + mod.title + '</h3></div>' +
                    '<p class="module-context">' + mod.description + '</p>' +
                    '<div class="module-meta">' +
                        '<span>⏱ ' + mod.hours + ' ч.</span><span>📚 ' + mod.topics.length + ' тем</span><span>🧮 Практика</span><span>🔬 ' + mod.interactive + '</span><span>🏗 ' + mod.context + '</span>' +
                    '</div>' +
                    '<div class="module-progress">' +
                        '<div class="module-progress-track"><div class="module-progress-fill" style="width:' + progress + '%"></div></div>' +
                        '<span class="module-progress-label">' + progress + '% тем</span>' +
                    '</div>' +
                '</div>' +
                '<div class="module-actions">' +
                    '<button class="status-button ' + status + '" type="button" data-status-module="' + mod.id + '">' + statusText + '</button>' +
                    '<button class="topics-toggle" type="button" aria-expanded="false" aria-controls="topics-' + mod.id + '" data-toggle-module="' + mod.id + '">' +
                        '<span>Темы</span><span class="topics-toggle-icon">↓</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="topics-panel" id="topics-' + mod.id + '">' +
                mod.topics.map(function(t, i) {
                    var ts = getTopicStatus(mod.id, i);
                    return '<div class="topic-row">' +
                        '<div class="topic-dots"><span class="topic-dot ' + (ts === 'ready' ? 'ready' : ts === 'review' ? 'review' : '') + '"></span></div>' +
                        '<span class="topic-name">' + t[0] + '</span>' +
                        '<a class="topic-link" href="' + mod.link + '#' + t[1] + '">📖 Открыть тему →</a>' +
                    '</div>';
                }).join('') +
            '</div>';

            (mod.course === 1 ? c1 : c2).appendChild(el);
        });

        renderControlPoints();
        bindEvents();
        updateEmptyStates();
    }

    function renderControlPoints() {
        [1,2].forEach(function(course) {
            document.getElementById('controls' + course).innerHTML =
                '<div class="control-points-title">Контрольные точки</div>' +
                '<div class="control-point-list">' + controlPoints[course].map(function(i) { return '<div class="control-point">📝 ' + i + '</div>'; }).join('') + '</div>';
        });
    }

    function bindEvents() {
        // Статус модуля
        document.querySelectorAll('[data-status-module]').forEach(function(b) {
            b.addEventListener('click', function() { cycleModuleStatus(b.dataset.statusModule); });
        });

        // Кнопка "Темы"
        document.querySelectorAll('[data-toggle-module]').forEach(function(b) {
            b.addEventListener('click', function(e) {
                e.stopPropagation();
                var panel = document.getElementById('topics-' + b.dataset.toggleModule);
                var open = panel.classList.toggle('open');
                b.setAttribute('aria-expanded', open);
            });
        });

        // Клик по карточке модуля
        document.querySelectorAll('.module-main').forEach(function(main) {
            main.addEventListener('click', function(e) {
                if (e.target.closest('button') || e.target.closest('a')) return;
                var toggleBtn = main.parentElement.querySelector('[data-toggle-module]');
                if (!toggleBtn) return;
                var panel = document.getElementById('topics-' + toggleBtn.dataset.toggleModule);
                var open = panel.classList.toggle('open');
                toggleBtn.setAttribute('aria-expanded', open);
            });
        });
    }

    function updateEmptyStates() {
        [1,2].forEach(function(course) {
            var section = document.querySelector('[data-course-section="' + course + '"]');
            var visible = section.querySelectorAll('.module-card:not([hidden])').length;
            document.getElementById('emptyCourse' + course).classList.toggle('visible', visible === 0);
        });
    }

    // ─── Фильтры ───────────────────────────────────────────────
    document.querySelectorAll('.course-filter').forEach(function(b) {
        b.addEventListener('click', function() {
            var filter = b.dataset.filter;
            document.querySelectorAll('.course-filter').forEach(function(btn) {
                btn.classList.toggle('active', btn.dataset.filter === filter);
                btn.setAttribute('aria-selected', btn.dataset.filter === filter);
            });
            document.querySelectorAll('[data-course-section]').forEach(function(section) {
                section.style.display = (filter === 'all' || filter === section.dataset.courseSection) ? '' : 'none';
            });
        });
    });

    // ─── Формула дня ───────────────────────────────────────────
    var today = new Date();
    var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    var formula = formulas[dayOfYear % formulas.length];
    var formulaEl = document.getElementById('formulaDay');
    if (formula.latex && typeof katex !== 'undefined') {
        katex.render(formula.latex, formulaEl, { throwOnError: false });
    } else {
        formulaEl.textContent = formula.text;
    }

    function openFormulaTopic() {
        var mod = modules.find(function(m) { return m.id === formula.moduleId; });
        if (mod) window.location.href = mod.link + '#' + formula.anchor;
    }
    document.getElementById('formulaDayContainer').addEventListener('click', openFormulaTopic);
    document.getElementById('formulaDayContainer').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFormulaTopic(); }
    });

    // ─── Сброс прогресса ───────────────────────────────────────
    document.getElementById('resetProgressButton').addEventListener('click', function() {
        if (!confirm('Сбросить весь прогресс обучения?')) return;
        modules.forEach(function(mod) {
            safeSet('module_status_' + mod.id, 'not-ready');
            mod.topics.forEach(function(_, i) { safeSet('topic_status_' + mod.id + '_' + i, 'not-ready'); });
        });
        renderModules();
        updateProgress();
    });

    // ─── Кнопка наверх ─────────────────────────────────────────
    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() { backToTop.classList.toggle('visible', window.scrollY > 500); });
    backToTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // ─── Инициализация ─────────────────────────────────────────
    renderModules();
    updateProgress();
})();