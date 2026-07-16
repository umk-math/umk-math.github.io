// ==========================================
// ОБЩИЕ ФУНКЦИИ И БАЗОВЫЙ КОНТРОЛЛЕР 3D-МОДЕЛЕЙ (v2.0)
// ==========================================
var threeModels = {};

// ---------- ГЛОБАЛЬНЫЕ КОНСТАНТЫ ----------
const DEFAULT_CYLINDER_RADIUS = 0.08;
const DEFAULT_TICK_RADIUS = 0.1;
const AXIS_LABEL_OFFSET = 6.8;

// ---------- УТИЛИТЫ ----------
function lerp(a, b, t) { return a + (b - a) * t; }

function createBumpTexture() {
    var canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    for (var i = 0; i < 2000; i++) {
        var x = Math.random() * 256, y = Math.random() * 256;
        var r = Math.random() * 4 + 1;
        var brightness = Math.floor(Math.random() * 60 + 98);
        ctx.fillStyle = 'rgb(' + brightness + ',' + brightness + ',' + brightness + ')';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

function makeAxisLabel(text, pos, color) {
    var canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = color;
    ctx.font = 'bold 46px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 34);
    var tex = new THREE.CanvasTexture(canvas);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sprite.position.copy(pos);
    sprite.scale.set(2.0, 1.0, 1);
    return sprite;
}

function makeLabel(text, pos, color, icon, lineStart, lineEnd, scene, labelsArr, edgeLinesArr, fontSize) {
    var canvas = document.createElement('canvas');
    canvas.width = 420; canvas.height = 80;
    var ctx = canvas.getContext('2d');
    ctx.shadowColor = 'rgba(0,0,0,0.9)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(13,17,23,0.85)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(8, 8, 404, 64, 12);
    else ctx.rect(8, 8, 404, 64);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.font = (fontSize || '34px') + ' Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(icon + ' ' + text, 210, 44);
    var tex = new THREE.CanvasTexture(canvas);
    var sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
    sprite.position.copy(pos);
    sprite.scale.set(3.6, 0.75, 1);
    scene.add(sprite);
    labelsArr.push(sprite);

    if (lineStart && lineEnd) {
        var points = [new THREE.Vector3(lineStart.x, lineStart.y, lineStart.z),
                      new THREE.Vector3(lineEnd.x, lineEnd.y, lineEnd.z)];
        var lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        var lineMat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.7 });
        var line = new THREE.Line(lineGeo, lineMat);
        scene.add(line);
        edgeLinesArr.push(line);
    }
}

function createCylinderBetween(point1, point2, radius, material, group) {
    var start = new THREE.Vector3(point1.x, point1.y, point1.z);
    var end = new THREE.Vector3(point2.x, point2.y, point2.z);
    var direction = new THREE.Vector3().subVectors(end, start);
    var length = direction.length();
    if (length < 0.001) return;
    var midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    var cylinderGeo = new THREE.CylinderGeometry(radius, radius, length, 8);
    var cylinder = new THREE.Mesh(cylinderGeo, material);
    cylinder.position.copy(midPoint);
    var quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    cylinder.applyQuaternion(quat);
    group.add(cylinder);
}

function createUnitCylinder(material, radius) {
    const geom = new THREE.CylinderGeometry(radius || DEFAULT_CYLINDER_RADIUS, radius || DEFAULT_CYLINDER_RADIUS, 1, 8);
    const cyl = new THREE.Mesh(geom, material);
    cyl.castShadow = true;
    cyl.receiveShadow = true;
    return cyl;
}

function positionCylinder(cylinder, start, end) {
    const sx = start[0], sy = start[1], sz = start[2];
    const ex = end[0], ey = end[1], ez = end[2];
    const dx = ex - sx, dy = ey - sy, dz = ez - sz;
    const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (length < 0.001) return;
    cylinder.position.set((sx + ex) / 2, (sy + ey) / 2, (sz + ez) / 2);
    cylinder.scale.set(1, length, 1);
    const direction = new THREE.Vector3(dx, dy, dz).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    cylinder.quaternion.copy(quat);
}
// Добавить в core.js, если отсутствует
function addDimensionTick(point, direction, color, parent) {
    const tickLength = 0.25;
    const tickRadius = 0.06;
    const perp = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
    const start = point.clone().addScaledVector(perp, -tickLength/2);
    const end = point.clone().addScaledVector(perp, tickLength/2);
    const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 });
    const cyl = createUnitCylinder(material, tickRadius);
    positionCylinder(cyl, [start.x, start.y, start.z], [end.x, end.y, end.z]);
    parent.add(cyl);
    return cyl;
}   
// ---------- СТАРАЯ СБОРКА ИНТЕРФЕЙСА (buildModelUI) ----------
function buildModelUI(containerId, config) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    container.style.cssText = 'background:#0a0e14;border-radius:18px;padding:18px;color:#c9d1d9;';
    container._modelConfig = config;

    var controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin-bottom:12px;';
    container.appendChild(controlsDiv);

    var sliders = [];
    config.sliders.forEach(function(s) {
        var ctrl = document.createElement('div');
        ctrl.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;';
        var lbl = document.createElement('label');
        lbl.innerHTML = '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + s.color + ';"></span> ' + s.label;
        lbl.style.cssText = 'color:#a1b0c0;font-size:13px;';
        var input = document.createElement('input');
        input.type = 'range';
        input.min = s.min; input.max = s.max; input.step = s.step; input.value = s.value;
        input.style.cssText = 'accent-color:#D4A017;width:140px;';
        var valSpan = document.createElement('span');
        valSpan.style.cssText = 'color:#D4A017;font-weight:700;font-size:16px;';
        valSpan.textContent = s.value.toFixed(s.decimals || 1);
        ctrl.appendChild(lbl); ctrl.appendChild(input); ctrl.appendChild(valSpan);
        controlsDiv.appendChild(ctrl);
        sliders.push({ el: input, display: valSpan, key: s.key, container: ctrl, color: s.color, defaultValue: s.defaultValue });
    });

    var actionBar = document.createElement('div');
    actionBar.style.cssText = 'text-align:center;margin:8px 0;';
    var resetBtn = document.createElement('button');
    resetBtn.textContent = '⟳ Сбросить';
    resetBtn.style.cssText = 'padding:6px 14px;background:#242c38;color:#D4A017;border:1px solid #D4A017;border-radius:6px;cursor:pointer;margin-right:8px;';
    var autoBtn = document.createElement('button');
    autoBtn.textContent = '🔄 Авто-вращение';
    autoBtn.style.cssText = 'padding:6px 14px;background:#242c38;color:#D4A017;border:1px solid #D4A017;border-radius:6px;cursor:pointer;';
    actionBar.appendChild(resetBtn);
    actionBar.appendChild(autoBtn);

    if (config.extraButtons) {
        config.extraButtons.forEach(function(btn) {
            var b = document.createElement('button');
            b.textContent = btn.label;
            b.style.cssText = btn.style || 'padding:6px 14px;background:#242c38;color:#D4A017;border:1px solid #D4A017;border-radius:6px;cursor:pointer;margin-left:8px;';
            b.addEventListener('click', btn.onClick);
            actionBar.appendChild(b);
        });
    }
    container.appendChild(actionBar);

    var viewer = document.createElement('div');
    viewer.style.cssText = 'width:100%;height:400px;background:#0a0e14;border-radius:12px;overflow:hidden;margin-bottom:10px;';
    container.appendChild(viewer);

    var infoPanel = document.createElement('div');
    infoPanel.style.cssText = 'background:rgba(255,255,255,0.03);border:1px solid #30363d;border-radius:10px;padding:12px;';
    infoPanel.innerHTML = config.infoTemplate;
    container.appendChild(infoPanel);

    if (config.contextTemplate) {
        var contextDiv = document.createElement('div');
        contextDiv.style.cssText = 'margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;font-size:13px;color:#b0b8c5;';
        contextDiv.innerHTML = config.contextTemplate;
        container.appendChild(contextDiv);
    }

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e14);
    var camera = new THREE.PerspectiveCamera(40, viewer.clientWidth / viewer.clientHeight, 0.1, 100);
    camera.position.set(config.cameraPos[0], config.cameraPos[1], config.cameraPos[2]);
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    viewer.appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = false;
    container._controls = controls;

    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    scene.add(new THREE.HemisphereLight(0xdddddd, 0x112233, 0.7));
    var keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(12, 22, 18);
    scene.add(keyLight);
    var rimLight = new THREE.DirectionalLight(0x99ccff, 1.0);
    rimLight.position.set(-18, 8, -16);
    scene.add(rimLight);

    scene.add(new THREE.AxesHelper(6));
    scene.add(makeAxisLabel('X', new THREE.Vector3(6.8,0,0), '#ff6b6b'));
    scene.add(makeAxisLabel('Y', new THREE.Vector3(0,7,0), '#4ade80'));
    scene.add(makeAxisLabel('Z', new THREE.Vector3(0,0,6.8), '#60a5fa'));

    var bumpTexture = createBumpTexture();
    var labels = [], edgeLines = [];
    var meshGroup = new THREE.Group();
    scene.add(meshGroup);

    window._targetVals = {};
    window._currentVals = {};
    sliders.forEach(function(s) {
        window._targetVals[s.key] = parseFloat(s.el.value);
        window._currentVals[s.key] = window._targetVals[s.key];
    });

    function rebuild() {
        while(meshGroup.children.length > 0) meshGroup.remove(meshGroup.children[0]);
        labels.forEach(function(l) { scene.remove(l); });
        edgeLines.forEach(function(l) { scene.remove(l); });
        labels = []; edgeLines = [];
        config.createGeometry(meshGroup, scene, labels, edgeLines, bumpTexture);
    }

    function updateInfo() { config.updateInfo(); }

    function animateDimensions() {
        var f = 0.17, changed = false;
        sliders.forEach(function(s) {
            var target = window._targetVals[s.key];
            var current = window._currentVals[s.key];
            if (Math.abs(current - target) > 0.001) {
                window._currentVals[s.key] = lerp(current, target, f);
                changed = true;
            } else if (current !== target) {
                window._currentVals[s.key] = target;
                changed = true;
            }
        });
        if (changed) {
            config.applyValues(window._currentVals);
            rebuild();
            updateInfo();
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        animateDimensions();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
        camera.aspect = viewer.clientWidth / viewer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    });

    rebuild();
    updateInfo();

    sliders.forEach(function(s) {
        s.el.addEventListener('input', function() {
            window._targetVals[s.key] = parseFloat(s.el.value);
            s.display.textContent = window._targetVals[s.key].toFixed(s.decimals || 1);
        });
    });

    resetBtn.addEventListener('click', function() {
        sliders.forEach(function(s) {
            s.el.value = s.defaultValue;
            window._targetVals[s.key] = s.defaultValue;
            s.display.textContent = s.defaultValue.toFixed(s.decimals || 1);
        });
    });

    autoBtn.addEventListener('click', function() {
        controls.autoRotate = !controls.autoRotate;
    });
}

// ========== НОВЫЙ БАЗОВЫЙ КОНТРОЛЛЕР (v2.0) ==========
class BaseModelController {
    constructor(containerId, config) {
        this.containerId = containerId;
        this.config = config;
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error('Container not found: ' + containerId);
        this.state = {};
        this.targetState = {};
        this.labels = [];
        this.edgeLines = [];
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.container.style.cssText = 'background:#0a0e14;border-radius:18px;padding:18px;color:#c9d1d9;';
        this.createUI();
        this.initThreeJS();
        this.attachEvents();
        this.rebuild();
        this.updateInfo();
        this.animate();
    }

    createUI() {
        this.controlsDiv = document.createElement('div');
        this.controlsDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:18px;justify-content:center;margin-bottom:12px;';
        this.container.appendChild(this.controlsDiv);

        this.sliders = [];
        this.state = {};
        this.targetState = {};
        this.config.sliders.forEach(s => {
            const ctrl = document.createElement('div');
            ctrl.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;';
            const lbl = document.createElement('label');
            lbl.innerHTML = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${s.color};"></span> ${s.label}`;
            lbl.style.cssText = 'color:#a1b0c0;font-size:13px;';
            const input = document.createElement('input');
            input.type = 'range';
            input.min = s.min; input.max = s.max; input.step = s.step; input.value = s.value;
            input.style.cssText = 'accent-color:#D4A017;width:140px;';
            const valSpan = document.createElement('span');
            valSpan.style.cssText = 'color:#D4A017;font-weight:700;font-size:16px;';
            valSpan.textContent = s.value.toFixed(s.decimals || 1);
            ctrl.appendChild(lbl); ctrl.appendChild(input); ctrl.appendChild(valSpan);
            this.controlsDiv.appendChild(ctrl);
            this.sliders.push({
                el: input, display: valSpan, key: s.key, container: ctrl, color: s.color,
                defaultValue: s.defaultValue, decimals: s.decimals || 1
            });
            this.state[s.key] = s.defaultValue;
            this.targetState[s.key] = s.defaultValue;
        });

        this.actionBar = document.createElement('div');
        this.actionBar.style.cssText = 'text-align:center;margin:8px 0;';
        this.resetBtn = this.createButton('⟳ Сбросить', () => this.resetSliders());
        this.autoBtn = this.createButton('🔄 Авто-вращение', () => { this.controls.autoRotate = !this.controls.autoRotate; });
        this.actionBar.appendChild(this.resetBtn);
        this.actionBar.appendChild(this.autoBtn);

        if (this.config.extraButtons) {
            this.config.extraButtons.forEach(btn => {
                const b = this.createButton(btn.label, btn.onClick);
                this.actionBar.appendChild(b);
            });
        }
        this.container.appendChild(this.actionBar);

        this.viewer = document.createElement('div');
        this.viewer.style.cssText = 'width:100%;height:400px;background:#0a0e14;border-radius:12px;overflow:hidden;margin-bottom:10px;';
        this.container.appendChild(this.viewer);

        this.infoPanel = document.createElement('div');
        this.infoPanel.style.cssText = 'background:rgba(255,255,255,0.03);border:1px solid #30363d;border-radius:10px;padding:12px;';
        this.infoPanel.innerHTML = this.config.infoTemplate;
        this.container.appendChild(this.infoPanel);

        if (this.config.contextTemplate) {
            this.contextDiv = document.createElement('div');
            this.contextDiv.style.cssText = 'margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;font-size:13px;color:#b0b8c5;';
            this.contextDiv.innerHTML = this.config.contextTemplate;
            this.container.appendChild(this.contextDiv);
        }
    }

    createButton(text, clickHandler) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = 'padding:6px 14px;background:#242c38;color:#D4A017;border:1px solid #D4A017;border-radius:6px;cursor:pointer;margin-right:8px;';
        btn.addEventListener('click', clickHandler);
        return btn;
    }

    initThreeJS() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e14);
        const width = this.viewer.clientWidth || 600;
        const height = this.viewer.clientHeight || 400;
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.camera.position.set(...this.config.cameraPos);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.viewer.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.autoRotate = false;
        this.container._controls = this.controls;

        this.scene.add(new THREE.AmbientLight(0x404060, 0.5));
        this.scene.add(new THREE.HemisphereLight(0xdddddd, 0x112233, 0.7));
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(12, 22, 18);
        this.scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0x99ccff, 1.0);
        rimLight.position.set(-18, 8, -16);
        this.scene.add(rimLight);

        this.axesHelper = new THREE.AxesHelper(6);
        this.scene.add(this.axesHelper);
        this.axisLabels = [
            makeAxisLabel('X', new THREE.Vector3(AXIS_LABEL_OFFSET,0,0), '#ff6b6b'),
            makeAxisLabel('Y', new THREE.Vector3(0,AXIS_LABEL_OFFSET-0.5,0), '#4ade80'),
            makeAxisLabel('Z', new THREE.Vector3(0,0,AXIS_LABEL_OFFSET), '#60a5fa')
        ];
        this.axisLabels.forEach(label => this.scene.add(label));

        this.gridHelper = new THREE.GridHelper(10, 20, 0x666666, 0x333333);
        this.scene.add(this.gridHelper);

        this.bumpTexture = createBumpTexture();
        this.modelGroup = new THREE.Group();
        this.scene.add(this.modelGroup);
    }

    attachEvents() {
        this.sliders.forEach(s => {
            s.el.addEventListener('input', () => {
                this.targetState[s.key] = parseFloat(s.el.value);
                s.display.textContent = this.targetState[s.key].toFixed(s.decimals);
            });
        });

        window.addEventListener('resize', () => {
            const w = this.viewer.clientWidth;
            const h = this.viewer.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });
    }

    enableEdgeHighlighting(mapping) {
        this.edgeHighlightMapping = mapping;
        this.sliders.forEach(s => {
            if (mapping[s.key]) {
                s.container.addEventListener('mouseenter', () => this._highlightEdges(s.key, true));
                s.container.addEventListener('mouseleave', () => this._highlightEdges(s.key, false));
            }
        });
    }

    _highlightEdges(sliderKey, active) {
        if (!this.edgeHighlightMapping || !this.edgeHighlightMapping[sliderKey]) return;
        const { cylinders, normalColor, highlightColor } = this.edgeHighlightMapping[sliderKey];
        const color = active ? highlightColor : normalColor;
        cylinders.forEach(cyl => {
            cyl.material.color.setHex(color);
            cyl.material.emissive = new THREE.Color(active ? color : 0x000000);
            cyl.material.emissiveIntensity = active ? 0.5 : 0;
        });
    }

    toggleAxes() {
        const visible = !this.axesHelper.visible;
        this.axesHelper.visible = visible;
        this.axisLabels.forEach(label => label.visible = visible);
    }

    rebuild() {
        while(this.modelGroup.children.length > 0) {
            const child = this.modelGroup.children[0];
            this.modelGroup.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        }
        this.labels.forEach(l => this.scene.remove(l));
        this.edgeLines.forEach(l => this.scene.remove(l));
        this.labels = [];
        this.edgeLines = [];
        this.createGeometry();
    }

    animateDimensions() {
        let changed = false;
        this.sliders.forEach(s => {
            const target = this.targetState[s.key];
            let current = this.state[s.key];
            if (Math.abs(current - target) > 0.001) {
                this.state[s.key] = lerp(current, target, 0.17);
                changed = true;
            } else if (current !== target) {
                this.state[s.key] = target;
                changed = true;
            }
        });
        if (changed) {
            this.rebuild();
            this.updateInfo();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.animateDimensions();
        this.renderer.render(this.scene, this.camera);
    }

    resetSliders() {
        this.sliders.forEach(s => {
            s.el.value = s.defaultValue;
            this.targetState[s.key] = s.defaultValue;
            s.display.textContent = s.defaultValue.toFixed(s.decimals);
        });
    }

    createGeometry() {}
    updateInfo() {}

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
            this.viewer.removeChild(this.renderer.domElement);
        }
        while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        this.container.innerHTML = '';
    }
}