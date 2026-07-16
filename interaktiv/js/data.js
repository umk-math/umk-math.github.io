// ==========================================
// ДАННЫЕ МОДЕЛЕЙ, КАЛЬКУЛЯТОРОВ, ТРЕНАЖЁРОВ, ТЕСТОВ
// ==========================================

// ===== МОДЕЛИ =====
var modelsData = [
    { id: 'm1', title: 'Параллелепипед', desc: 'Изменяйте длину, ширину, высоту — объём меняется.', tags: ['3D', 'Геометрия'], type: 'three_parallelepiped', context: 'Фундаменты, стены, перекрытия, опалубка' },
    { id: 'm2', title: 'Пирамида', desc: 'Изменяйте сторону основания и высоту — объём меняется.', tags: ['3D', 'Пирамида'], type: 'three_pyramid', context: 'Кровля, шатровые крыши, объёмные конструкции' },
    { id: 'm3', title: 'График y = ax² + bx + c', desc: 'Исследуйте влияние коэффициентов на параболу.', tags: ['Алгебра', 'Графики'], type: 'param_graph', context: '' },
    { id: 'm4', title: 'Тригонометрический круг', desc: 'Вращайте точку — sin, cos, tg меняются.', tags: ['Тригонометрия'], type: 'trig_circle', context: '' },
    { id: 'm5', title: 'Теорема Пифагора', desc: 'Меняйте катеты — гипотенуза и площади обновляются.', tags: ['Геометрия', 'Теорема'], type: 'pythagoras', context: '' },
    { id: 'm6', title: 'Сечение куба', desc: 'Изменяйте угол наклона плоскости — сечение меняется.', tags: ['Стереометрия', 'Сечения'], type: 'three_cube_section', context: 'Архитектурные разрезы, 3D-моделирование' },
    { id: 'm7', title: 'Квадратичная функция', desc: 'Изучение коэффициентов a, b и c квадратичной функции.', tags: ['Алгебра', 'Графики'], type: 'quadratic', context: '' },
    { id: 'm8', title: 'Касательная к графику', desc: 'Исследование производной через касательную.', tags: ['Алгебра', 'Производная'], type: 'tangent', context: '' },
    { id: 'm9', title: 'Определённый интеграл', desc: 'Визуализация площади под кривой.', tags: ['Алгебра', 'Интегралы'], type: 'integral', context: '' }
];

// ===== ЛАБОРАТОРИИ =====
var labsData = [
    { id: 'l1', title: 'Свойства логарифмов', desc: 'Изучайте основные свойства логарифмов.', tags: ['Алгебра', 'Логарифмы'], type: 'log_properties', context: '' },
    { id: 'l2', title: 'Тригонометрические тождества', desc: 'Изучайте основные тригонометрические тождества.', tags: ['Тригонометрия'], type: 'trig_identities', context: '' },
    { id: 'l3', title: 'Свойства корней', desc: 'Изучайте свойства корней n-й степени.', tags: ['Алгебра', 'Корни'], type: 'roots', context: '' },
    { id: 'l4', title: 'Первообразная', desc: 'Изучайте основные формулы первообразных.', tags: ['Алгебра', 'Интегралы'], type: 'antiderivative', context: '' },
    { id: 'l5', title: 'Касательная (лаборатория)', desc: 'Исследование производной на примере касательной.', tags: ['Алгебра', 'Производная'], type: 'tangent_lab', context: '' }
];

var allModels = modelsData.concat(labsData);
var modelIds = allModels.map(function(m) { return m.id; });

// ===== КАЛЬКУЛЯТОРЫ =====
var calculators = [
    { id:'c1', title:'🏗️ Объём бетона', desc:'Расчёт объёма бетона для фундамента, стен и перекрытий.',
        fields:[{name:'length',label:'Длина (м)',default:10,step:0.5},{name:'width',label:'Ширина (м)',default:6,step:0.5},{name:'height',label:'Высота (м)',default:0.5,step:0.1}],
        formula:function(v){ return v.length * v.width * v.height; }, unit:'м³', historyKey:'calc_beton', teacherNote:'V = a × b × h' },
    { id:'c2', title:'🧱 Количество кирпича', desc:'Расчёт количества кирпича для кладки стен.',
        fields:[{name:'length',label:'Длина стены (м)',default:10,step:0.5},{name:'height',label:'Высота стены (м)',default:3,step:0.1},{name:'thickness',label:'Толщина кладки (м)',default:0.38,step:0.01}],
        formula:function(v){ return Math.ceil(v.length * v.height * v.thickness * 400); }, unit:'шт', historyKey:'calc_brick', teacherNote:'N = L × H × T × 400' },
    { id:'c3', title:'🔲 Расход плитки', desc:'Расчёт количества плитки для пола и стен.',
        fields:[{name:'length',label:'Длина (м)',default:5,step:0.5},{name:'width',label:'Ширина (м)',default:4,step:0.5},{name:'tileSize',label:'Размер плитки (м²)',type:'select',options:['0.09','0.16','0.25','0.36'],default:'0.16'}],
        formula:function(v){ return Math.ceil((v.length * v.width) / parseFloat(v.tileSize) * 1.05); }, unit:'шт (с запасом 5%)', historyKey:'calc_tile', teacherNote:'N = S_пов / S_плитки × 1.05' },
    { id:'c4', title:'📐 Уклон кровли', desc:'Расчёт угла наклона кровли.',
        fields:[{name:'height',label:'Высота конька (м)',default:3,step:0.1},{name:'span',label:'Ширина пролёта (м)',default:6,step:0.5}],
        formula:function(v){ var angle = Math.atan(v.height / (v.span / 2)) * 180 / Math.PI; return angle.toFixed(1); }, unit:'градусов', historyKey:'calc_roof', teacherNote:'α = arctg(h / (L/2))' },
    { id:'c5', title:'🎨 Расход краски', desc:'Расчёт количества краски для стен и фасадов.',
        fields:[{name:'length',label:'Длина стены (м)',default:10,step:0.5},{name:'height',label:'Высота стены (м)',default:3,step:0.1},{name:'coverage',label:'Расход (м²/л)',default:8,step:0.5}],
        formula:function(v){ return (v.length * v.height / v.coverage).toFixed(1); }, unit:'л', historyKey:'calc_paint', teacherNote:'V = S / R' },
    { id:'c6', title:'🪜 Расчёт лестницы', desc:'Расчёт параметров лестничного марша.',
        fields:[{name:'height',label:'Высота подъёма (м)',default:3,step:0.1},{name:'tread',label:'Ширина проступи (м)',default:0.3,step:0.01},{name:'riser',label:'Высота подступенка (м)',default:0.15,step:0.01}],
        formula:function(v){ var steps = Math.round(v.height / v.riser); var length = steps * v.tread; return 'Ступеней: ' + steps + ', длина марша: ' + length.toFixed(2) + ' м'; }, unit:'', historyKey:'calc_stairs', teacherNote:'N = H / h_riser, L = N × l_tread' },
    { id:'c7', title:'🔩 Расчёт арматуры', desc:'Расчёт арматуры для фундамента.',
        fields:[{name:'length',label:'Длина (м)',default:10,step:0.5},{name:'width',label:'Ширина (м)',default:6,step:0.5},{name:'rods',label:'Прутков на 1 м²',default:8,step:1}],
        formula:function(v){ return Math.ceil(v.length * v.width * v.rods / 10); }, unit:'прутков (10 м)', historyKey:'calc_rebar', teacherNote:'N = L × W × n / 10' },
    { id:'c8', title:'📊 Площадь фасада', desc:'Расчёт площади фасада.',
        fields:[{name:'length',label:'Длина фасада (м)',default:20,step:0.5},{name:'height',label:'Высота фасада (м)',default:8,step:0.1},{name:'windows',label:'Площадь окон (м²)',default:5,step:0.5}],
        formula:function(v){ return (v.length * v.height - v.windows).toFixed(1); }, unit:'м²', historyKey:'calc_facade', teacherNote:'S = L × H — S_окон' }
];

// ===== ТРЕНАЖЁРЫ =====
var trainers = [
    { id:'t1', title:'Решение квадратного уравнения', desc:'Найдите корни уравнения ax²+bx+c=0.',
        fields:[{name:'a',label:'a',default:1,step:0.1},{name:'b',label:'b',default:-3,step:0.1},{name:'c',label:'c',default:2,step:0.1}],
        solve:function(v){ var D = v.b * v.b - 4 * v.a * v.c; if (D < 0) return 'Нет действительных корней'; var x1 = (-v.b - Math.sqrt(D)) / (2 * v.a); var x2 = (-v.b + Math.sqrt(D)) / (2 * v.a); return 'x₁ = ' + x1.toFixed(2) + ', x₂ = ' + x2.toFixed(2); } },
    { id:'t2', title:'Упрощение выражения', desc:'Упростите выражение (a+b)².',
        fields:[{name:'a',label:'a',default:2,step:0.1},{name:'b',label:'b',default:3,step:0.1}],
        solve:function(v){ var result = v.a * v.a + 2 * v.a * v.b + v.b * v.b; return result.toFixed(2); } },
    { id:'t3', title:'Вычисление sin/cos', desc:'Вычислите sin и cos угла α.',
        fields:[{name:'alpha',label:'α (градусы)',default:30,step:1}],
        solve:function(v){ var rad = v.alpha * Math.PI / 180; return 'sin = ' + Math.sin(rad).toFixed(4) + ', cos = ' + Math.cos(rad).toFixed(4); } },
    { id:'t4', title:'Объём цилиндра', desc:'Вычислите объём цилиндра по радиусу и высоте.',
        fields:[{name:'r',label:'Радиус (м)',default:1,step:0.1},{name:'h',label:'Высота (м)',default:2,step:0.1}],
        solve:function(v){ var V = Math.PI * v.r * v.r * v.h; return 'V = ' + V.toFixed(3) + ' м³'; } }
];

// ===== ТЕСТЫ =====
var tests = [
    { id:'test1', title:'Тест по алгебре', desc:'Проверьте знания по алгебре.',
        questions:[
            {q:'Чему равно (a+b)²?', options:['a²+b²','a²+2ab+b²','a²-2ab+b²','2ab'], correct:1, explanation:'(a+b)² = a² + 2ab + b²'},
            {q:'Корни уравнения x²-5x+6=0:', options:['2 и 3','1 и 6','-2 и -3','3 и -2'], correct:0, explanation:'(x-2)(x-3)=0 → x=2, x=3'},
            {q:'Чему равно значение выражения 2³?', options:['6','8','9','4'], correct:1, explanation:'2³ = 2·2·2 = 8'}
        ] },
    { id:'test2', title:'Тест по геометрии', desc:'Проверьте знания по геометрии.',
        questions:[
            {q:'Сумма углов треугольника равна:', options:['90°','180°','270°','360°'], correct:1, explanation:'Сумма углов любого треугольника = 180°'},
            {q:'Площадь прямоугольника со сторонами 4 и 5:', options:['20','10','9','15'], correct:0, explanation:'S = a·b = 4·5 = 20'},
            {q:'Чему равна длина окружности радиуса 1?', options:['π','2π','π/2','4π'], correct:1, explanation:'C = 2πr = 2π'}
        ] },
    { id:'test3', title:'Тест по тригонометрии', desc:'Проверьте знания тригонометрии.',
        questions:[
            {q:'sin(0°)=', options:['0','1','-1','0.5'], correct:0, explanation:'sin(0°) = 0'},
            {q:'cos(0°)=', options:['0','1','-1','0.5'], correct:1, explanation:'cos(0°) = 1'},
            {q:'tg(45°)=', options:['0','1','-1','∞'], correct:1, explanation:'tg(45°) = 1'}
        ] }
];