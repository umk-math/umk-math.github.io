// ==========================================
// КАЛЬКУЛЯТОРЫ
// ==========================================
function renderCalculators() {
    var container = document.getElementById('calculatorsContainer');
    if (!container) return;
    container.innerHTML = calculators.map(function(calc) {
        var history = JSON.parse(localStorage.getItem(calc.historyKey)) || [];
        var lastResult = history.length > 0 ? history[history.length - 1] : null;
        // Убираем эмодзи из названий
        var cleanTitle = calc.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
        return '<div class="calculator-card" id="calc-' + calc.id + '">' +
            '<span class="teacher-badge">Преподаватель</span>' +
            '<h4>' + cleanTitle + '</h4>' +
            '<p class="calc-desc">' + calc.desc + '</p>' +
            '<div class="calc-row">' +
            calc.fields.map(function(f) {
                if (f.type === 'select') {
                    return '<label><span>' + f.label + '</span><select id="' + calc.id + '_' + f.name + '" onchange="calculate(\'' + calc.id + '\')">' +
                        f.options.map(function(o) { return '<option value="' + o + '" ' + (o === f.default ? 'selected' : '') + '>' + o + '</option>'; }).join('') +
                        '</select></label>';
                } else {
                    return '<label><span>' + f.label + '</span><input type="number" id="' + calc.id + '_' + f.name + '" value="' + f.default + '" step="' + f.step + '" oninput="calculate(\'' + calc.id + '\')"></label>';
                }
            }).join('') +
            '</div>' +
            '<button class="btn-gold" onclick="calculate(\'' + calc.id + '\')" style="padding:6px 16px;font-size:13px;">Рассчитать</button>' +
            '<div class="calc-result" id="' + calc.id + '_result">' +
            '<span class="label">Результат:</span>' +
            '<span class="value">— <span class="unit">' + calc.unit + '</span></span>' +
            '</div>' +
            '<div class="calc-history" id="' + calc.id + '_history">' +
            (lastResult ? '<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">Последний расчёт:</div><div style="display:flex;justify-content:space-between;font-size:12px;"><span>' + lastResult.date + '</span><span style="color:var(--gold);font-weight:600;">' + lastResult.result + '</span></div>' : '') +
            '</div>' +
            '<div class="calc-teacher-note">' + (calc.teacherNote || '') + '</div>' +
            '</div>';
    }).join('');
}