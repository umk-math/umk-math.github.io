// ==========================================
// JSXGRAPH МОДЕЛИ (2D-графики, триг. круг, теорема и т.д.)
// ==========================================
function initJSXModel(type, containerId) {
    var board = JXG.JSXGraph.initBoard(containerId, {
        boundingbox: [-7.5, 7.5, 7.5, -7.5],
        axis: true,
        grid: true,
        showNavigation: true,
        showCopyright: false,
        keepAspectRatio: true,
        defaultAxes: {
            x: { name: 'x', withLabel: true, strokeColor: '#6b7a8f', strokeWidth: 2.5 },
            y: { name: 'y', withLabel: true, strokeColor: '#6b7a8f', strokeWidth: 2.5 }
        }
    });
    window._currentBoard = board;

    var gold = '#D4A017';
    var green = '#4ade80';
    var blue = '#60a5fa';
    var accent = '#ff6b6b';
    var textColor = '#e6edf3';
    var muted = '#8b949e';

    board.update();

    // ---------- ПАРАБОЛА (y = ax² + bx + c) ----------
    if (type === 'param_graph') {
        var aSl = board.create('slider', [[-6.5,6.5],[-2,6.5],[-3,1,3]], {name:'a', strokeColor:gold, label:{fontSize:14}});
        var bSl = board.create('slider', [[-6.5,5.5],[-2,5.5],[-5,0,5]], {name:'b', strokeColor:gold, label:{fontSize:14}});
        var cSl = board.create('slider', [[-6.5,4.5],[-2,4.5],[-5,0,5]], {name:'c', strokeColor:gold, label:{fontSize:14}});
        var f = board.create('functiongraph', [function(x){ return aSl.Value()*x*x + bSl.Value()*x + cSl.Value(); }, -6.5,6.5], {strokeColor:gold, strokeWidth:5});
        board.create('text', [-7, 7.2, 'y = ax² + bx + c'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.4, function(){ return 'a = ' + aSl.Value().toFixed(2) + ', b = ' + bSl.Value().toFixed(2) + ', c = ' + cSl.Value().toFixed(2); }], {fontSize:15, color:gold});
        board.create('point', [function(){ return -bSl.Value()/(2*aSl.Value()); }, function(){ var x = -bSl.Value()/(2*aSl.Value()); return aSl.Value()*x*x + bSl.Value()*x + cSl.Value(); }], {name:'Вершина', color:accent, size:6});
        board.create('point', [function(){ var D = bSl.Value()*bSl.Value() - 4*aSl.Value()*cSl.Value(); if (D<0) return NaN; return (-bSl.Value() - Math.sqrt(D))/(2*aSl.Value()); }, 0], {name:'x₁', color:green, size:6});
        board.create('point', [function(){ var D = bSl.Value()*bSl.Value() - 4*aSl.Value()*cSl.Value(); if (D<0) return NaN; return (-bSl.Value() + Math.sqrt(D))/(2*aSl.Value()); }, 0], {name:'x₂', color:green, size:6});
        board.create('text', [-7, 3.6, function(){ var D = bSl.Value()*bSl.Value() - 4*aSl.Value()*cSl.Value(); return 'D = ' + D.toFixed(2); }], {fontSize:14, color:muted});
        return;
    }

    // ---------- ТРИГОНОМЕТРИЧЕСКИЙ КРУГ ----------
    if (type === 'trig_circle') {
        board.create('circle', [[0,0],5], {strokeColor:'#636e72', strokeWidth:2.5});
        board.create('line', [[0,0],[1,0]], {strokeColor:'#636e72', strokeWidth:1.5});
        board.create('line', [[0,0],[0,1]], {strokeColor:'#636e72', strokeWidth:1.5});
        var glider = board.create('glider', [1,0], board.defaultAxes.x, {name:'α', color:gold, size:7});
        var point = board.create('point', [function(){ return 5*Math.cos(glider.X()); }, function(){ return 5*Math.sin(glider.X()); }], {color:gold, size:7});
        board.create('segment', [[0,0], point], {strokeColor:gold, strokeWidth:3.5});
        board.create('text', [-7, 7.2, 'Тригонометрический круг'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.4, function(){ return 'sin(α) = ' + Math.sin(glider.X()).toFixed(2); }], {fontSize:15, color:green});
        board.create('text', [-7, 5.7, function(){ return 'cos(α) = ' + Math.cos(glider.X()).toFixed(2); }], {fontSize:15, color:blue});
        board.create('text', [-7, 5.0, function(){ return 'tg(α) = ' + (Math.tan(glider.X())).toFixed(2); }], {fontSize:15, color:gold});
        board.create('text', [-7, 4.3, function(){ return 'α = ' + (glider.X()*180/Math.PI).toFixed(1) + '°'; }], {fontSize:14, color:muted});
        return;
    }

    // ---------- ТЕОРЕМА ПИФАГОРА ----------
    if (type === 'pythagoras') {
        var aSl = board.create('slider', [[-6.5,6.5],[-2,6.5],[1,3,6]], {name:'a (катет)', strokeColor:green, label:{fontSize:14}});
        var bSl = board.create('slider', [[-6.5,5.5],[-2,5.5],[1,4,6]], {name:'b (катет)', strokeColor:blue, label:{fontSize:14}});
        var pA = board.create('point', [0,0], {visible:false});
        var pB = board.create('point', [function(){ return aSl.Value(); }, 0], {visible:false});
        var pC = board.create('point', [0, function(){ return bSl.Value(); }], {visible:false});
        board.create('segment', [pA,pB], {strokeColor:green, strokeWidth:4});
        board.create('segment', [pA,pC], {strokeColor:blue, strokeWidth:4});
        board.create('segment', [pB,pC], {strokeColor:gold, strokeWidth:4});
        board.create('text', [function(){ return aSl.Value()/2; }, -0.7, function(){ return 'a = ' + aSl.Value().toFixed(1); }], {fontSize:15, color:green});
        board.create('text', [-0.8, function(){ return bSl.Value()/2; }, function(){ return 'b = ' + bSl.Value().toFixed(1); }], {fontSize:15, color:blue});
        board.create('text', [function(){ return aSl.Value()/2+0.4; }, function(){ return bSl.Value()/2+0.4; }, function(){ var c = Math.sqrt(aSl.Value()*aSl.Value() + bSl.Value()*bSl.Value()); return 'c = ' + c.toFixed(2); }], {fontSize:17, color:gold, fontWeight:'bold'});
        board.create('text', [function(){ return aSl.Value()/2; }, function(){ return -0.8 - aSl.Value()/2; }, function(){ return 'a² = ' + (aSl.Value()*aSl.Value()).toFixed(1); }], {fontSize:14, color:green});
        board.create('text', [function(){ return -0.8 - bSl.Value()/2; }, function(){ return bSl.Value()/2; }, function(){ return 'b² = ' + (bSl.Value()*bSl.Value()).toFixed(1); }], {fontSize:14, color:blue});
        board.create('text', [-7, 7.2, 'Теорема Пифагора'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.4, function(){ var c = Math.sqrt(aSl.Value()*aSl.Value() + bSl.Value()*bSl.Value()); return aSl.Value().toFixed(1) + '² + ' + bSl.Value().toFixed(1) + '² = ' + c.toFixed(2) + '²'; }], {fontSize:16, color:gold});
        board.create('angle', [pB,pA,pC], {radius:0.6, strokeColor:'#8b949e'});
        return;
    }

    // ---------- КВАДРАТИЧНАЯ ФУНКЦИЯ ----------
    if (type === 'quadratic') {
        var aSl = board.create('slider', [[-6.5,6.5],[-2,6.5],[-3,1,3]], {name:'a', strokeColor:gold, label:{fontSize:14}});
        var bSl = board.create('slider', [[-6.5,5.5],[-2,5.5],[-5,0,5]], {name:'b', strokeColor:gold, label:{fontSize:14}});
        var cSl = board.create('slider', [[-6.5,4.5],[-2,4.5],[-5,0,5]], {name:'c', strokeColor:gold, label:{fontSize:14}});
        board.create('functiongraph', [function(x){ return aSl.Value()*x*x + bSl.Value()*x + cSl.Value(); }, -6.5,6.5], {strokeColor:gold, strokeWidth:5});
        board.create('text', [-7, 7.2, 'Квадратичная функция'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.4, function(){ return 'y = ' + aSl.Value().toFixed(2) + 'x² + ' + bSl.Value().toFixed(2) + 'x + ' + cSl.Value().toFixed(2); }], {fontSize:16, color:gold});
        return;
    }

    // ---------- КАСАТЕЛЬНАЯ ----------
    if (type === 'tangent' || type === 'tangent_lab') {
        var f = function(x){ return 0.15*x*x*x - 0.4*x*x + x + 1; };
        var df = function(x){ return 0.45*x*x - 0.8*x + 1; };
        board.create('functiongraph', [f, -5.5,5.5], {strokeColor:'#636e72', strokeWidth:2.5});
        var glider = board.create('glider', [1, f(1), board.create('functiongraph',[f,-5.5,5.5])], {name:'P', color:gold, size:7});
        board.create('tangent', [glider], {strokeColor:accent, strokeWidth:4, dash:0});
        board.create('text', [-7, 7.2, 'Касательная к графику'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.4, 'Двигайте точку P по графику'], {fontSize:14, color:muted});
        board.create('text', [-7, 5.7, function(){
            var x0 = glider.X();
            var y0 = f(x0);
            var k = df(x0);
            return 'f\'' + x0.toFixed(2) + ' = ' + k.toFixed(3) + ',  y = ' + k.toFixed(2) + '(x - ' + x0.toFixed(2) + ') + ' + y0.toFixed(2);
        }], {fontSize:15, color:gold});
        return;
    }

    // ---------- ОПРЕДЕЛЁННЫЙ ИНТЕГРАЛ ----------
    if (type === 'integral') {
        var f = function(x){ return 0.2*x*x + 1; };
        board.create('functiongraph', [f, -5.5,5.5], {strokeColor:gold, strokeWidth:5});
        var aSl = board.create('slider', [[-6.5,5.5],[-3,5.5],[-4.5,-2,2]], {name:'a (нижний)', strokeColor:blue, label:{fontSize:13}});
        var bSl = board.create('slider', [[-6.5,4.5],[-3,4.5],[-2,2,5]], {name:'b (верхний)', strokeColor:green, label:{fontSize:13}});
        board.create('integral', [aSl, bSl, function(x){ return f(x); }], {fillColor:gold, fillOpacity:0.4});
        board.create('text', [-7, 7.2, 'Определённый интеграл'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.4, function(){ var a = aSl.Value(); var b = bSl.Value(); var area = (0.2/3)*(b*b*b - a*a*a) + (b - a); return 'S = ∫ₐᵇ f(x) dx = ' + area.toFixed(3); }], {fontSize:16, color:gold});
        return;
    }

    // ---------- ЛАБОРАТОРИИ (логарифмы, тождества, корни, первообразная) ----------
    if (type === 'log_properties') {
        board.create('text', [-7, 7.2, 'Свойства логарифмов'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.2, 'logₐ(x·y) = logₐx + logₐy'], {fontSize:17, color:gold});
        board.create('text', [-7, 5.4, 'logₐ(x/y) = logₐx - logₐy'], {fontSize:17, color:gold});
        board.create('text', [-7, 4.6, 'logₐ(xⁿ) = n·logₐx'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.8, 'logₐa = 1, logₐ1 = 0'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.0, 'a^(logₐx) = x'], {fontSize:17, color:gold});
        return;
    }

    if (type === 'trig_identities') {
        board.create('text', [-7, 7.2, 'Тригонометрические тождества'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.2, 'sin²α + cos²α = 1'], {fontSize:17, color:gold});
        board.create('text', [-7, 5.4, 'sin(α±β) = sinα·cosβ ± cosα·sinβ'], {fontSize:17, color:gold});
        board.create('text', [-7, 4.6, 'cos(α±β) = cosα·cosβ ∓ sinα·sinβ'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.8, 'sin(2α) = 2sinα·cosα'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.0, 'cos(2α) = cos²α − sin²α'], {fontSize:17, color:gold});
        return;
    }

    if (type === 'roots') {
        board.create('text', [-7, 7.2, 'Свойства корней n-й степени'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.2, 'ⁿ√(a·b) = ⁿ√a · ⁿ√b'], {fontSize:17, color:gold});
        board.create('text', [-7, 5.4, 'ⁿ√(a/b) = ⁿ√a / ⁿ√b'], {fontSize:17, color:gold});
        board.create('text', [-7, 4.6, '(ⁿ√a)ⁿ = a'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.8, 'ⁿ√(aᵐ) = a^(m/n)'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.0, 'ᵐ√(ⁿ√a) = ⁿᵐ√a'], {fontSize:17, color:gold});
        return;
    }

    if (type === 'antiderivative') {
        board.create('text', [-7, 7.2, 'Первообразная'], {fontSize:19, color:textColor, fontWeight:'bold'});
        board.create('text', [-7, 6.2, 'F(x) = ∫f(x)dx'], {fontSize:17, color:gold});
        board.create('text', [-7, 5.4, 'f(x) = x² → F(x) = x³/3 + C'], {fontSize:17, color:gold});
        board.create('text', [-7, 4.6, 'f(x) = sin(x) → F(x) = -cos(x) + C'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.8, 'f(x) = eˣ → F(x) = eˣ + C'], {fontSize:17, color:gold});
        board.create('text', [-7, 3.0, 'f(x) = 1/x → F(x) = ln|x| + C'], {fontSize:17, color:gold});
        return;
    }

    // Fallback
    board.create('text', [-5, 5, 'Модель загружена'], {fontSize:16, color:muted});
}