// ==========================================
// ДОСТИЖЕНИЯ
// ==========================================
function renderAchievements() {
    var container = document.getElementById('achievementsContainer');
    if (!container) return;
    container.innerHTML = achievementsList.map(function(a) {
        var unlocked = a.check();
        var progress = a.progress ? a.progress() : 0;
        var cleanIcon = a.icon.replace(/[\u{1F300}-\u{1F9FF}]/gu, '★');
        return '<div class="achievement-card' + (unlocked ? ' achievement-unlock-animation' : '') + '">' +
            '<div class="ach-icon">' + cleanIcon + '</div>' +
            '<div class="ach-info">' +
            '<h4>' + a.title + '</h4>' +
            '<p>' + a.desc + '</p>' +
            (a.max ? '<div class="ach-progress-bar"><div class="fill" style="width:' + (progress/a.max*100) + '%"></div></div>' : '') +
            '</div>' +
            '<div class="ach-status ' + (unlocked ? 'unlocked' : 'locked') + '">' + (unlocked ? 'Получено' : 'Закрыто') + '</div>' +
            '</div>';
    }).join('');
}