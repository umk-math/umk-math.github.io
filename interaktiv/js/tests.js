// ==========================================
// ТЕСТЫ
// ==========================================
function renderTests() {
    var container = document.getElementById('testsContainer');
    if (!container) return;
    container.innerHTML = tests.map(function(test) {
        var cleanTitle = test.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
        return '<div class="test-card" id="test-' + test.id + '">' +
            '<span class="teacher-badge">Преподаватель</span>' +
            '<h4>' + cleanTitle + '</h4>' +
            '<p class="test-desc">' + test.desc + '</p>' +
            test.questions.map(function(q, i) {
                return '<div class="test-question">' +
                    '<div class="q-text">' + (i+1) + '. ' + q.q + '</div>' +
                    '<div class="q-options">' + q.options.map(function(opt, j) {
                        return '<label><input type="radio" name="q' + test.id + '_' + i + '" value="' + j + '" onchange="selectAnswer(\'' + test.id + '\', ' + i + ', ' + j + ')"> ' + opt + '</label>';
                    }).join('') + '</div></div>';
            }).join('') +
            '<button class="btn-gold" onclick="checkTest(\'' + test.id + '\')" style="padding:6px 16px;font-size:13px;">Проверить</button>' +
            '<div class="test-result" id="' + test.id + '_result"></div>' +
            '<div class="test-teacher-answers" id="' + test.id + '_answers"></div>' +
            '</div>';
    }).join('');
}