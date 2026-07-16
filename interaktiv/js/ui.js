// ==========================================
// UI — РЕНДЕР, ВКЛАДКИ, МОДАЛКА, ПОИСК
// ==========================================

// ===== ИКОНКИ ДЛЯ КАРТОЧЕК (без эмодзи) =====
var iconsMap = {
    three_parallelepiped: '▣',
    three_pyramid: '▲',
    three_cube_section: '✂',
    param_graph: '◈',
    trig_circle: '⊙',
    pythagoras: '△',
    quadratic: '▨',
    tangent: '⌇',
    integral: '∫',
    log_properties: 'log',
    trig_identities: '≡',
    roots: '√',
    antiderivative: '∫',
    tangent_lab: '⌇'
};

// ===== РЕНДЕР КАРТОЧЕК МОДЕЛЕЙ =====
function renderModels() {
    var container = document.getElementById('modelsGrid');
    if (!container) return;
    container.innerHTML = modelsData.map(function(m) {
        return createCard(m);
    }).join('');
}

// ===== РЕНДЕР КАРТОЧЕК ЛАБОРАТОРИЙ =====
function renderLabs() {
    var container = document.getElementById('labsGrid');
    if (!container) return;
    container.innerHTML = labsData.map(function(m) {
        return createCard(m);
    }).join('');
}

// ===== СОЗДАНИЕ ОДНОЙ КАРТОЧКИ =====
function createCard(model) {
    var isFav = favorites.indexOf(model.id) !== -1;
    var isCompleted = progress.completed.indexOf(model.id) !== -1;
    var icon = iconsMap[model.type] || '●';
    var tagsStr = model.tags.join(' ');
    return '<div class="model-card" data-id="' + model.id + '" data-tags="' + tagsStr + '">' +
        '<div class="icon-big">' + icon + '</div>' +
        '<h4>' + model.title + '</h4>' +
        '<p>' + model.desc + '</p>' +
        '<div class="model-tags">' + model.tags.map(function(t) {
            return '<span class="model-tag">' + t + '</span>';
        }).join('') + '</div>' +
        '<div class="card-footer">' +
        '<button class="btn-sm" onclick="openModel(\'' + model.id + '\')">Открыть →</button>' +
        '<button class="favorite-btn ' + (isFav ? 'active' : '') + '" onclick="toggleFavorite(\'' + model.id + '\')">' + (isFav ? '★' : '☆') + '</button>' +
        '</div>' +
        (isCompleted ? '<div class="model-completed">✓ Пройдено</div>' : '') +
        '</div>';
}

// ===== РЕНДЕР ИЗБРАННОГО =====
function renderFavorites() {
    var container = document.getElementById('favoritesGrid');
    if (!container) return;
    var favModels = allModels.filter(function(m) {
        return favorites.indexOf(m.id) !== -1;
    });
    container.innerHTML = favModels.length ?
        favModels.map(function(m) { return createCard(m); }).join('') :
        '<p style="color:var(--text-muted);grid-column:1/-1;font-size:13px;text-align:center;padding:20px 0;">★ Нет избранных моделей</p>';
}

// ===== ОТКРЫТИЕ МОДЕЛИ =====
function openModel(id) {
    markCompleted(id);
    var all = modelsData.concat(labsData);
    var model = all.find(function(m) { return m.id === id; });
    if (!model) return;

    var overlay = document.getElementById('modalOverlay');
    document.getElementById('modalTitle').textContent = model.title;
    document.getElementById('modalDesc').textContent = model.desc;
    var contextEl = document.getElementById('modalContext');
    if (contextEl && model.context) {
        contextEl.textContent = '⌂ ' + model.context;
        contextEl.style.display = 'block';
    } else if (contextEl) {
        contextEl.style.display = 'none';
    }

    var body = document.getElementById('modalBody');
    body.innerHTML = '<div class="loader-overlay">⏳ Загрузка модели...</div>';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    var threeTypes = ['three_parallelepiped', 'three_pyramid', 'three_cube_section'];
    var isThree = threeTypes.indexOf(model.type) !== -1;

    if (isThree) {
        if (typeof THREE === 'undefined') {
            var script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
            script.onload = function() {
                var orbitScript = document.createElement('script');
                orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js';
                orbitScript.onload = function() {
                    initThreeModel(model.type, body);
                };
                document.head.appendChild(orbitScript);
            };
            document.head.appendChild(script);
        } else {
            initThreeModel(model.type, body);
        }
    } else {
        if (typeof JXG === 'undefined') {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js';
            script.onload = function() {
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css';
                document.head.appendChild(link);
                initJSXModel(model.type, body);
            };
            document.head.appendChild(script);
        } else {
            initJSXModel(model.type, body);
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ THREE.JS МОДЕЛИ =====
function initThreeModel(type, body) {
    body.innerHTML = '';
    var container = document.createElement('div');
    container.className = 'three-container';
    container.id = 'three-container';
    body.appendChild(container);

    if (threeModels && typeof threeModels[type] === 'function') {
        threeModels[type]('three-container');
    } else {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Модель в разработке</p>';
    }
}

// ===== ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА =====
function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    var body = document.getElementById('modalBody');
    // Очистка Three.js
    var threeContainer = body.querySelector('.three-container');
    if (threeContainer) {
        var renderer = threeContainer._renderer;
        if (renderer) {
            renderer.dispose();
            threeContainer.innerHTML = '';
        }
    }
    // Очистка JSXGraph
    var jsxContainer = body.querySelector('#jsx-container');
    if (jsxContainer) {
        var board = window._currentBoard;
        if (board) {
            JXG.JSXGraph.freeBoard(board);
            window._currentBoard = null;
        }
        jsxContainer.innerHTML = '';
    }
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    body.innerHTML = '<div class="loader-overlay">⏳ Загрузка модели...</div>';
}

// ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
function switchTab(tabId) {
    currentTab = tabId;
    document.querySelectorAll('.tab-content').forEach(function(el) {
        el.classList.remove('active');
    });

    var targetMap = {
        models: 'tabModels',
        calculators: 'tabCalculators',
        trainers: 'tabTrainers',
        tests: 'tabTests',
        labs: 'tabLabs',
        achievements: 'tabAchievements',
        favorites: 'tabFavorites'
    };
    var target = document.getElementById(targetMap[tabId]);
    if (target) target.classList.add('active');

    document.querySelectorAll('.sidebar-item[data-tab]').forEach(function(el) {
        el.classList.toggle('active', el.dataset.tab === tabId);
    });

    if (tabId === 'calculators') renderCalculators();
    else if (tabId === 'trainers') renderTrainers();
    else if (tabId === 'tests') renderTests();
    else if (tabId === 'achievements') renderAchievements();
    else if (tabId === 'favorites') renderFavorites();
    else if (tabId === 'labs') renderLabs();

    document.getElementById('searchModels').value = '';
    searchQuery = '';
    applySearch();
}

// ===== ОБРАБОТЧИКИ ДЛЯ SIDEBAR =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.sidebar-item[data-tab]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    document.getElementById('favoritesTab').addEventListener('click', function() {
        switchTab('favorites');
        document.querySelectorAll('.sidebar-item[data-tab]').forEach(function(el) {
            el.classList.remove('active');
        });
        this.classList.add('active');
        renderFavorites();
    });

    // Режим преподавателя
    document.getElementById('teacherModeToggle').addEventListener('click', function() {
        teacherMode = !teacherMode;
        localStorage.setItem('interaktiv_teacher_mode', JSON.stringify(teacherMode));
        this.classList.toggle('active');
        this.style.color = teacherMode ? 'var(--gold)' : '';
        document.body.classList.toggle('teacher-mode', teacherMode);
        alert(teacherMode ? '[Преподаватель] Режим преподавателя включён.' : '[Преподаватель] Режим преподавателя выключен.');
    });

    // Сброс прогресса
    document.getElementById('resetProgressBtn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
            localStorage.clear();
            favorites = [];
            progress = { completed: [] };
            testResults = {};
            selectedAnswers = {};
            localStorage.setItem('interaktiv_favorites', JSON.stringify(favorites));
            localStorage.setItem('interaktiv_progress', JSON.stringify(progress));
            localStorage.setItem('interaktiv_test_results', JSON.stringify(testResults));
            renderModels();
            renderLabs();
            renderCalculators();
            renderTrainers();
            renderTests();
            renderAchievements();
            updateProgress();
            updateFavCount();
            updateStats();
            alert('Прогресс сброшен.');
        }
    });

    // Поиск
    document.getElementById('searchModels').addEventListener('input', function() {
        searchQuery = this.value.toLowerCase().trim();
        applySearch();
    });

    // Кнопка "Наверх"
    var backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        backToTop.classList.toggle('show', window.scrollY > 300);
    });
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Модалка: клик по оверлею
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Клавиша Escape для закрытия модалки
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
});

// ===== ПОИСК =====
function applySearch() {
    var activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    var cards = activeTab.querySelectorAll('.model-card, .calculator-card, .trainer-card, .test-card');
    cards.forEach(function(card) {
        var text = card.innerText.toLowerCase();
        var tags = card.dataset.tags ? card.dataset.tags.toLowerCase() : '';
        var match = text.indexOf(searchQuery) !== -1 || tags.indexOf(searchQuery) !== -1;
        card.style.display = match ? '' : 'none';
    });
}

// ===== СЛУЧАЙНОЕ ЗАДАНИЕ =====
function randomCard() {
    var cards = document.querySelectorAll('.model-card');
    if (!cards.length) return;
    var random = cards[Math.floor(Math.random() * cards.length)];
    random.scrollIntoView({ behavior: 'smooth', block: 'center' });
    random.style.borderColor = 'var(--gold)';
    random.style.boxShadow = '0 0 20px rgba(212,160,23,0.2)';
    setTimeout(function() {
        random.style.borderColor = '';
        random.style.boxShadow = '';
    }, 2000);
    var id = random.dataset.id;
    if (id) openModel(id);
}

// ===== ПРОГРЕСС =====
function markCompleted(id) {
    if (progress.completed.indexOf(id) === -1) {
        progress.completed.push(id);
        localStorage.setItem('interaktiv_progress', JSON.stringify(progress));
        updateProgress();
        renderModels();
        renderLabs();
        renderFavorites();
        checkAchievements();
    }
}

function updateProgress() {
    var total = allModels.length + trainers.length + tests.length;
    var completedModels = progress.completed.filter(function(id) {
        return modelIds.indexOf(id) !== -1;
    }).length;
    var completedTrainers = trainers.filter(function(t, i) {
        return progress.completed.indexOf('trainer_' + t.id) !== -1;
    }).length;
    var completedTests = tests.filter(function(t) {
        return testResults[t.id] && testResults[t.id].score === 100;
    }).length;
    var completed = completedModels + completedTrainers + completedTests;
    var pct = Math.round((completed / total) * 100);
    document.getElementById('mainProgress').style.width = pct + '%';
    document.getElementById('progressText').textContent = 'Пройдено ' + completed + ' из ' + total;
    updateStats();
}

function updateStats() {
    var completedModels = progress.completed.filter(function(id) {
        return modelIds.indexOf(id) !== -1;
    }).length;
    document.getElementById('statModels').textContent = completedModels;
    document.getElementById('statFavorites').textContent = favorites.length;
    var unlocked = achievementsList.filter(function(a) { return a.check(); }).length;
    document.getElementById('statAchievements').textContent = unlocked;
    var passed = tests.filter(function(t) {
        return testResults[t.id] && testResults[t.id].score === 100;
    }).length;
    document.getElementById('statTests').textContent = passed;
}

function updateFavCount() {
    document.getElementById('favCount').textContent = favorites.length;
}

// ===== ИЗБРАННОЕ =====
function toggleFavorite(id) {
    var index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('interaktiv_favorites', JSON.stringify(favorites));
    updateFavCount();
    renderModels();
    renderLabs();
    renderFavorites();
    updateStats();
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function() {
    renderModels();
    renderLabs();
    renderCalculators();
    renderTrainers();
    renderTests();
    renderAchievements();
    updateProgress();
    updateFavCount();
    updateStats();
    if (teacherMode) {
        document.getElementById('teacherModeToggle').style.color = 'var(--gold)';
        document.getElementById('teacherModeToggle').classList.add('active');
        document.body.classList.add('teacher-mode');
    }
});