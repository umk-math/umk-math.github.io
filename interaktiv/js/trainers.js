// ==========================================
// ТРЕНАЖЁРЫ
// ==========================================
function renderTrainers() {
    var container = document.getElementById('trainersContainer');
    if (!container) return;
    container.innerHTML = trainers.map(function(t) {
        var cleanTitle = t.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
        return '<div class="trainer-card">' +
            '<h4>' + cleanTitle + '</h4>' +
            '<p class="trainer-desc">' + t.desc + '</p>' +
            '<div class="trainer-controls">' +
            t.fields.map(function(f) {
                return '<label>' + f.label + ' <input type="number" id="' + t.id + '_' + f.name + '" value="' + f.default + '" step="' + f.step + '">';
            }).join('') +
            '</div>' +
            '<button class="btn-gold" onclick="solveTrainer(\'' + t.id + '\')" style="padding:6px 16px;font-size:13px;">Решить</button>' +
            '<div class="trainer-result" id="' + t.id + '_result"><span class="label">Ответ:</span><span class="value">—</span></div>' +
            '</div>';
    }).join('');
}