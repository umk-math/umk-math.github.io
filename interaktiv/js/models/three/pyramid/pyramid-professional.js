// ==========================================
// PIRAMID PROFESSIONAL – контроллер (исправленная версия)
// ==========================================

class PyramidController extends BaseModelController {
    constructor(containerId) {
        // Флаг, чтобы первый rebuild выполнил createGeometry, а не updateGeometry
        this._needsFullRebuild = true;

        super(containerId, {
            sliders: [
                { label: 'Сторона (a)', color: '#ff6b6b', key: 'a', min: 1, max: 8, step: 0.1, value: 3, defaultValue: 3, decimals: 1 },
                { label: 'Высота (h)', color: '#4ade80', key: 'h', min: 1, max: 8, step: 0.1, value: 4, defaultValue: 4, decimals: 1 }
            ],
            cameraPos: [9, 7, 11],
            infoTemplate: `
                <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-bottom:6px;">
                    <div style="text-align:center;"><span style="font-size:11px;color:#6b7a8f;">a</span><br><span id="infoA" style="font-size:18px;color:#D4A017;">3.0 м</span></div>
                    <div style="text-align:center;"><span style="font-size:11px;color:#6b7a8f;">h</span><br><span id="infoH" style="font-size:18px;color:#D4A017;">4.0 м</span></div>
                    <div style="text-align:center;"><span style="font-size:11px;color:#6b7a8f;">S осн</span><br><span id="infoS" style="font-size:18px;color:#D4A017;">9.00 м²</span></div>
                    <div style="text-align:center;"><span style="font-size:11px;color:#6b7a8f;">V</span><br><span id="infoV" style="font-size:18px;color:#D4A017;">12.00 м³</span></div>
                </div>
                <div style="text-align:center; font-size:16px; color:#D4A017; font-family: 'Times New Roman', serif; margin-bottom:4px;">
                    V = ⅓ · S · h = <span id="formulaVShort">12.00</span> м³
                    <span id="formulaToggle" style="font-size:13px; color:#8b949e; cursor:pointer; margin-left:6px;" title="Подробнее">?</span>
                </div>
                <div id="formulaBlock" style="display:none; text-align:center; margin-top:4px;">
                    <canvas id="formulaCanvas" width="380" height="100" style="vertical-align:middle;"></canvas>
                </div>
            `,
            contextTemplate: `
                <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; font-size:12px; color:#b0b8c5;">
                    <span>🔺 шатровые крыши</span><span>🏗️ павильоны</span><span>🗼 башни</span><span>🎨 декор</span>
                </div>
            `,
            extraButtons: [
                { label: '🧊', title: 'Объём', onClick: () => this.setDisplayMode('solid') },
                { label: '🔍', title: 'Прозрачный', onClick: () => this.setDisplayMode('transparent') },
                { label: '📏', title: 'Чертёж', onClick: () => this.setDisplayMode('blueprint') },
                { label: '⋮', title: 'Ещё', onClick: () => this._toggleMoreMenu() }
            ]
        });

        this.displayMode = 'solid';
        this.isBlueprint = false;
        // geometry создаётся лениво в createGeometry
        this.geometry = null;

        this._setupEdgeHighlighting();
        this._initFormulaToggle();
        this._renderFormula();
        setTimeout(() => this._animateIntro(), 100);
    }

    createGeometry() {
        if (!this.state || this.state.a === undefined) return;
        // Ленивое создание геометрии при первом вызове
        if (!this.geometry) {
            this.geometry = new PyramidGeometry(this.scene, this.bumpTexture);
        }
        this.geometry.build(this.state.a, this.state.h, this.displayMode);
        this.applyDisplayMode();
        this._updateEdgeHighlightMapping();
    }

    updateGeometry() {
        if (!this.geometry) return;
        if (!this.state || this.state.a === undefined) return;
        this.geometry.update(this.state.a, this.state.h, this.displayMode);
        this.applyDisplayMode();
        this._updateEdgeHighlightMapping();
    }

    rebuild() {
        if (this._needsFullRebuild) {
            super.rebuild();        // вызовет createGeometry()
            this._needsFullRebuild = false;
        } else {
            this.updateGeometry();
        }
    }

    setDisplayMode(mode) {
        if (mode === this.displayMode) return;
        this.displayMode = mode;
        this.isBlueprint = (mode === 'blueprint');
        this.scene.background = new THREE.Color(
            this.isBlueprint ? 0xffffff : 0x0a0e14
        );
        this._needsFullRebuild = true;
        this.rebuild();
    }

    applyDisplayMode() {
        if (this.geometry) this.geometry._applyDisplayMode(this.displayMode);
    }

    _updateEdgeHighlightMapping() {
        if (this.geometry && this.geometry.edgeCylinders.length >= 8) {
            this.edgeHighlightMapping['a'].cylinders = this.geometry.edgeCylinders.slice(0, 4);
            this.edgeHighlightMapping['h'].cylinders = this.geometry.edgeCylinders.slice(4, 8);
        }
    }

    _setupEdgeHighlighting() {
        this.edgeHighlightMapping = {
            'a': { cylinders: [], normalColor: 0xFFB347, highlightColor: 0xff3333 },
            'h': { cylinders: [], normalColor: 0xFFB347, highlightColor: 0x33ff33 }
        };
        this.enableEdgeHighlighting(this.edgeHighlightMapping);
    }

    updateInfo() {
        const a = this.state.a, h = this.state.h;
        const S = a * a;
        const apophema = Math.sqrt((a/2)*(a/2) + h*h);
        const V = (1/3) * S * h;

        document.getElementById('infoA').textContent = a.toFixed(1) + ' м';
        document.getElementById('infoH').textContent = h.toFixed(1) + ' м';
        document.getElementById('infoS').textContent = S.toFixed(2) + ' м²';
        document.getElementById('infoV').textContent = V.toFixed(2) + ' м³';
        document.getElementById('formulaVShort').textContent = V.toFixed(2);
        this._renderFormula(a, h, S, apophema, V);
    }

    _renderFormula(a = this.state.a, h = this.state.h, S = a*a, l = Math.sqrt((a/2)*(a/2) + h*h), V = (1/3)*S*h) {
        const canvas = document.getElementById('formulaCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#D4A017';
        ctx.font = '16px "Times New Roman", serif';
        ctx.textAlign = 'center';

        ctx.fillText('V =', 30, 65);
        ctx.fillText('1', 72, 54);
        ctx.beginPath();
        ctx.moveTo(60, 60);
        ctx.lineTo(90, 60);
        ctx.strokeStyle = '#D4A017';
        ctx.stroke();
        ctx.fillText('3', 72, 76);
        ctx.fillText('· S · h =', 100, 65);
        ctx.fillText(V.toFixed(2) + ' м³', 250, 65);

        ctx.font = '14px "Times New Roman", serif';
        ctx.fillText('S = a² = ' + a.toFixed(1) + '² = ' + S.toFixed(2) + ' м²', canvas.width/2, 20);
        ctx.fillText('l = √((a/2)² + h²) = ' + l.toFixed(2) + ' м', canvas.width/2, 40);
    }

    _initFormulaToggle() {
        const el = document.getElementById('formulaToggle');
        const block = document.getElementById('formulaBlock');
        if (!el || !block) return;
        el.addEventListener('click', () => {
            if (block.style.display === 'none' || !block.style.display) {
                block.style.display = 'block';
                el.textContent = '×';
                this._renderFormula();
            } else {
                block.style.display = 'none';
                el.textContent = '?';
            }
        });
    }

    _toggleMoreMenu() {
        const old = document.getElementById('pyramid-more-menu');
        if (old) { old.remove(); return; }

        const menu = document.createElement('div');
        menu.id = 'pyramid-more-menu';
        menu.style.cssText = 'position:absolute; background:#242c38; border:1px solid #D4A017; border-radius:6px; padding:4px; z-index:999;';
        const actions = [
            { label: '📐 Каркас', action: () => { this.setDisplayMode('wireframe'); menu.remove(); } },
            { label: '🔲 Рёбра', action: () => { this.setDisplayMode('edges-only'); menu.remove(); } },
            { label: '🧭 Оси', action: () => { this.toggleAxes(); menu.remove(); } }
        ];
        actions.forEach(a => {
            const btn = document.createElement('button');
            btn.textContent = a.label;
            btn.style.cssText = 'display:block; width:100%; background:none; border:none; color:#D4A017; padding:4px 8px; font-size:13px; cursor:pointer; text-align:left;';
            btn.addEventListener('click', a.action);
            menu.appendChild(btn);
        });

        const btn = this.actionBar.querySelector('button:last-child');
        if (btn) {
            const rect = btn.getBoundingClientRect();
            menu.style.left = rect.left + 'px';
            menu.style.top = (rect.bottom + 4) + 'px';
        }
        document.body.appendChild(menu);

        const closeHandler = (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 10);
    }

    _animateIntro() {
        const camera = this.camera;
        const targetPos = camera.position.clone();
        const startPos = targetPos.clone().add(new THREE.Vector3(4, 2, 5));
        camera.position.copy(startPos);

        if (this.geometry && this.geometry.mesh) this.geometry.mesh.material.opacity = 0;
        if (this.geometry) {
            this.geometry.edgeCylinders.forEach(cyl => cyl.visible = false);
            if (this.geometry.heightLine) this.geometry.heightLine.visible = false;
            if (this.geometry.apothemLine) this.geometry.apothemLine.visible = false;
        }

        const startTime = Date.now();
        const duration = 1000;

        const animate = () => {
            const now = Date.now();
            const t = Math.min((now - startTime) / duration, 1);
            camera.position.lerpVectors(startPos, targetPos, t);

            if (this.geometry && this.geometry.mesh) {
                this.geometry.mesh.material.opacity = t * 0.82;
                if (t > 0.5) {
                    this.geometry.edgeCylinders.forEach(cyl => cyl.visible = true);
                    if (this.geometry.heightLine) this.geometry.heightLine.visible = true;
                    if (this.geometry.apothemLine) this.geometry.apothemLine.visible = true;
                }
            }

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                camera.position.copy(targetPos);
                if (this.geometry && this.geometry.mesh) this.geometry.mesh.material.opacity = 0.82;
                if (this.geometry) {
                    this.geometry.edgeCylinders.forEach(cyl => cyl.visible = true);
                    if (this.geometry.heightLine) this.geometry.heightLine.visible = true;
                    if (this.geometry.apothemLine) this.geometry.apothemLine.visible = true;
                }
                this.controls.autoRotate = true;
                setTimeout(() => { this.controls.autoRotate = false; }, 3000);
            }
        };
        animate();
    }

    dispose() {
        if (this.geometry) this.geometry.dispose();
        super.dispose();
    }
}

// Точка входа для регистрации в threeModels
threeModels.three_pyramid = function(containerId) {
    new PyramidController(containerId);
};