const CURRICULUM = {

    formulas: [
        { text: 'sin²α + cos²α = 1', latex: '\\sin^{2}\\alpha + \\cos^{2}\\alpha = 1', moduleId: 'trig', anchor: 'tozhdestva' },
        { text: 'aᵐ · aⁿ = aᵐ⁺ⁿ', latex: 'a^{m} \\cdot a^{n} = a^{m+n}', moduleId: 'step', anchor: 'svoistva-stepenei' },
        { text: 'V призмы = Sₒₛₙ · H', latex: 'V = S_{\\text{осн}} \\cdot H', moduleId: 'polyhedra', anchor: 'obemy' },
        { text: 'f′(x₀) = tg α', latex: 'f\'(x_{0}) = \\operatorname{tg}\\alpha', moduleId: 'deriv', anchor: 'geom-smysl' },
        { text: 'logₐ(xy) = logₐx + logₐy', latex: '\\log_{a}(xy) = \\log_{a}x + \\log_{a}y', moduleId: 'log', anchor: 'svoistva-logarifmov' },
        { text: 'V шара = ⁴⁄₃πR³', latex: 'V = \\frac{4}{3}\\pi R^{3}', moduleId: 'rot', anchor: 'obem-shara' },
        { text: '√(x²) = |x|', latex: '\\sqrt{x^{2}} = |x|', moduleId: 'roots', anchor: 'svoistva-kornei' },
        { text: 'Прямая ⊥ плоскости, если ⊥ двум прямым в ней', latex: '', moduleId: 'perp', anchor: 'priznak-perp' },
        { text: 'Через 3 точки проходит единственная плоскость', latex: '', moduleId: 'stereo', anchor: 'aksiomy' }
    ],

    modules: [
        // I КУРС (часы скорректированы, чтобы вместе с extraHours дать 120)
        {
            id: 'trig', course: 1, icon: '📐', title: 'Тригонометрия',
            description: 'Углы, тригонометрические функции и уравнения.',
            hours: 35, practice: true, interactive: 'Тригонометрический круг',
            context: 'Уклоны · арки · геодезия', link: 'theory/trigonometriya.html',
            topics: [
                ['Единичная окружность и меры углов', 'okruzhnost'],
                ['Синус и косинус произвольного угла', 'sin-cos'],
                ['Тангенс и котангенс', 'tg-ctg'],
                ['Тригонометрические тождества', 'tozhdestva'],
                ['Формулы приведения', 'privedeniya'],
                ['Формулы суммы и разности', 'sum-razn'],
                ['Тригонометрические уравнения', 'uravneniya'],
                ['Функции y = sin x, y = cos x, y = tg x', 'grafiki'],
                ['Арксинус, арккосинус, арктангенс', 'arcsin'],
                ['Обобщение', 'obobshenie']
            ]
        },
        {
            id: 'stereo', course: 1, icon: '🧊', title: 'Введение в стереометрию',
            description: 'Пространственные фигуры, аксиомы и сечения.',
            hours: 12, practice: true, interactive: '3D-модели',
            context: 'Чертежи · разметка', link: 'theory/stereometriya.html',
            topics: [
                ['Многоугольники и их свойства', 'mnogougolniki'],
                ['Пространственные фигуры и их изображения', 'prostranstvennye-figury'],
                ['Аксиомы стереометрии', 'aksiomy'],
                ['Следствия из аксиом', 'sledstviya'],
                ['Сечения многогранников', 'secheniya']
            ]
        },
        {
            id: 'roots', course: 1, icon: '√', title: 'Корни и степени',
            description: 'Корни n-й степени и иррациональные уравнения.',
            hours: 18, practice: true, interactive: 'График степенной функции',
            context: 'Размеры · пропорции', link: 'theory/koren-n-stepeni.html',
            topics: [
                ['Понятие корня n-й степени', 'ponyatie-kornya'],
                ['Свойства корней n-й степени', 'svoistva-kornei'],
                ['Преобразование выражений с корнями', 'preobrazovaniya'],
                ['Иррациональные уравнения', 'irracionalnye'],
                ['Степенная функция', 'stepennaya-funkciya'],
                ['Самостоятельная работа', 'samostoyatelnaya']
            ]
        },
        {
            id: 'parallel', course: 1, icon: '⫽', title: 'Параллельность в пространстве',
            description: 'Взаимное расположение прямых и плоскостей.',
            hours: 15, practice: true, interactive: '3D-визуализация',
            context: 'Каркасное строительство', link: 'theory/parallel-perpend.html',
            topics: [
                ['Параллельные прямые в пространстве', 'parallelnye-pryamye'],
                ['Скрещивающиеся прямые', 'skreshivayushiesya'],
                ['Параллельность прямой и плоскости', 'parallel-pryamoi'],
                ['Параллельность плоскостей', 'parallel-ploskostei'],
                ['Свойства параллельных плоскостей', 'svoistva-ploskostei']
            ]
        },
        {
            id: 'deriv', course: 1, icon: '∫', title: 'Производная',
            description: 'Изменение функций, касательная и исследование функций.',
            hours: 16, practice: true, interactive: 'Касательная · интеграл',
            context: 'Оптимизация конструкций', link: 'theory/proizvodnaya.html',
            topics: [
                ['Определение производной', 'opredelenie'],
                ['Правила дифференцирования', 'pravila'],
                ['Производная степенной функции', 'stepennaya'],
                ['Производная суммы, произведения и частного', 'sum-proizv'],
                ['Геометрический смысл производной', 'geom-smysl'],
                ['Признаки возрастания и убывания', 'vozrastanie'],
                ['Экстремумы функции', 'ekstremumy'],
                ['Исследование функции', 'issledovanie'],
                ['Наибольшее и наименьшее значения', 'naibolshee']
            ]
        },
        {
            id: 'perp', course: 1, icon: '⟂', title: 'Перпендикулярность в пространстве',
            description: 'Перпендикулярность прямых и плоскостей.',
            hours: 17, practice: true, interactive: '3D-модель',
            context: 'Вертикальность стен', link: 'theory/parallel-perpend.html',
            topics: [
                ['Перпендикулярность прямой и плоскости', 'perp-pryamoi'],
                ['Признак перпендикулярности', 'priznak-perp'],
                ['Перпендикуляр и наклонная', 'perpendikulyar'],
                ['Теорема о трёх перпендикулярах', 'teorema-3-perp'],
                ['Угол между прямой и плоскостью', 'ugol'],
                ['Двугранный угол', 'dvugrannyi'],
                ['Перпендикулярные плоскости', 'perp-ploskosti']
            ]
        },

        // II КУРС (часы скорректированы)
        {
            id: 'step', course: 2, icon: 'x²', title: 'Степень с рациональным показателем',
            description: 'Рациональные показатели и преобразование выражений.',
            hours: 12, practice: true, interactive: 'График степенной функции',
            context: 'Прочностные расчёты', link: 'theory/stepeni-funktsii.html',
            topics: [
                ['Понятие степени с рациональным показателем', 'ponyatie'],
                ['Свойства степеней', 'svoistva-stepenei'],
                ['Преобразование выражений', 'preobrazovaniya'],
                ['Степенная функция и её график', 'grafik']
            ]
        },
        {
            id: 'exp', course: 2, icon: '📈', title: 'Показательная функция',
            description: 'Показательные функции, уравнения и неравенства.',
            hours: 17, practice: true, interactive: 'График показательной функции',
            context: 'Рост нагрузок', link: 'theory/stepeni-funktsii.html',
            topics: [
                ['Показательная функция и её свойства', 'svoistva'],
                ['Показательные уравнения', 'uravneniya'],
                ['Показательные неравенства', 'neravenstva'],
                ['Обобщение', 'obobshenie']
            ]
        },
        {
            id: 'polyhedra', course: 2, icon: '📦', title: 'Многогранники и объёмы',
            description: 'Призмы, пирамиды, площади и объёмы.',
            hours: 28, practice: true, interactive: '3D-модели',
            context: 'Фундаменты · кровли · опалубка', link: 'theory/mnogogranniki.html',
            topics: [
                ['Призма', 'prizma'],
                ['Параллелепипед', 'parallelepiped'],
                ['Пирамида', 'piramida'],
                ['Усечённая пирамида', 'usechennaya'],
                ['Площади поверхностей', 'ploshchadi'],
                ['Объёмы многогранников', 'obemy'],
                ['Обобщение', 'obobshenie']
            ]
        },
        {
            id: 'log', course: 2, icon: '📊', title: 'Логарифмическая функция',
            description: 'Логарифмы, графики, уравнения и неравенства.',
            hours: 24, practice: true, interactive: 'График логарифма',
            context: 'Децибелы · pH', link: 'theory/logarifmy.html',
            topics: [
                ['Понятие логарифма', 'ponyatie-logarifma'],
                ['Основное логарифмическое тождество', 'tozhdestvo'],
                ['Свойства логарифмов', 'svoistva-logarifmov'],
                ['Логарифмическая функция и её график', 'grafik'],
                ['Логарифмические уравнения', 'uravneniya'],
                ['Логарифмические неравенства', 'neravenstva'],
                ['Обобщение', 'obobshenie']
            ]
        },
        {
            id: 'rot', course: 2, icon: '⚪', title: 'Тела вращения',
            description: 'Сфера, цилиндр, конус и их характеристики.',
            hours: 17, practice: true, interactive: '3D-модели',
            context: 'Резервуары · купола · трубы', link: 'theory/tela-vrashcheniya.html',
            topics: [
                ['Сфера и шар', 'sfera'],
                ['Сечение шара плоскостью', 'secenie'],
                ['Цилиндр', 'cilindr'],
                ['Площадь поверхности и объём цилиндра', 'obem-cilindra'],
                ['Конус', 'konus'],
                ['Объём конуса', 'obem-konusa']
            ]
        }
    ],

    controlPoints: {
        1: [
            'Контрольная работа №1 · Тригонометрия',
            'Контрольная работа №2 · Производная',
            'Контрольная работа №3 · Перпендикулярность'
        ],
        2: [
            'Контрольная работа №4 · Показательная функция',
            'Контрольная работа №5 · Логарифмическая функция',
            'Контрольная работа №6 · Тела вращения'
        ]
    },

    extraHours: {
        1: 7,   // контрольные + повторение I курса
        2: 22   // контрольные + итоговое повторение II курса
    }
};