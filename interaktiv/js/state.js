// ==========================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// ==========================================
var favorites = JSON.parse(localStorage.getItem('interaktiv_favorites')) || [];
var progress = JSON.parse(localStorage.getItem('interaktiv_progress')) || { completed: [] };
var teacherMode = JSON.parse(localStorage.getItem('interaktiv_teacher_mode')) || false;
var testResults = JSON.parse(localStorage.getItem('interaktiv_test_results')) || {};
var selectedAnswers = {};
var currentTab = 'models';
var searchQuery = '';

// Сохранение состояния в localStorage (если нужно)
function saveState() {
    localStorage.setItem('interaktiv_favorites', JSON.stringify(favorites));
    localStorage.setItem('interaktiv_progress', JSON.stringify(progress));
    localStorage.setItem('interaktiv_teacher_mode', JSON.stringify(teacherMode));
    localStorage.setItem('interaktiv_test_results', JSON.stringify(testResults));
}