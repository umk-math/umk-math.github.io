// ==========================================
// ТРЁХМЕРНАЯ МОДЕЛЬ: ПАРАЛЛЕЛЕПИПЕД
// ==========================================
threeModels.three_parallelepiped = function(containerId) {
    buildModelUI(containerId, {
        sliders: [
            { label: 'Длина (X)', color: '#ff6b6b', key: 'L', min: 0.5, max: 8, step: 0.1, value: 4.2, defaultValue: 4.2, decimals: 1 },
            { label: 'Ширина (Z)', color: '#60a5fa', key: 'W', min: 0.5, max: 8, step: 0.1, value: 2.6, defaultValue: 2.6, decimals: 1 },
            { label: 'Высота (Y)', color: '#4ade80', key: 'H', min: 0.5, max: 8, step: 0.1, value: 3.1, defaultValue: 3.1, decimals: 1 }
        ],
        cameraPos: [11.5, 9.5, 14.5],
        infoTemplate: 
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;">' +
                '<div><div style="font-size:12px;color:#6b7a8f;">Длина</div><div id="infoL" style="font-size:22px;color:#D4A017;">4.2 м</div></div>' +
                '<div><div style="font-size:12px;color:#6b7a8f;">Ширина</div><div id="infoW" style="font-size:22px;color:#D4A017;">2.6 м</div></div>' +
                '<div><div style="font-size:12px;color:#6b7a8f;">Высота</div><div id="infoH" style="font-size:22px;color:#D4A017;">3.1 м</div></div>' +
                '<div><div style="font-size:12px;color:#6b7a8f;">Объём</div><div id="infoV" style="font-size:22px;color:#D4A017;">33.85 м³</div></div>' +
            '</div>' +
            '<div id="formula" style="text-align:center;font-size:16px;color:#D4A017;margin-top:8px;">V = <span id="formulaL">4.2</span> × <span id="formulaW">2.6</span> × <span id="formulaH">3.1</span></div>',
        contextTemplate: 
            '<div>📏 Длина <strong id="ctxL">4.2</strong> м <span style="color:#D4A017;">→ фундаментная плита</span></div>' +
            '<div>📐 Ширина <strong id="ctxW">2.6</strong> м <span style="color:#D4A017;">→ ширина стены</span></div>' +
            '<div>📐 Высота <strong id="ctxH">3.1</strong> м <span style="color:#D4A017;">→ высота этажа</span></div>' +
            '<div>🧊 Объём <strong id="ctxV">33.85</strong> м³ <span id="ctxHint">(≈ 3 миксера по 12 м³)</span></div>',
        createGeometry: function(group, scene, labels, edgeLines, bumpTexture) {
            var l = window._currentVals.L, w = window._currentVals.W, h = window._currentVals.H;
            var geo = new THREE.BoxGeometry(l, h, w);
            var mat = new THREE.MeshPhysicalMaterial({
                color: 0xE8C46A, metalness: 0.4, roughness: 0.3,
                clearcoat: 0.2, clearcoatRoughness: 0.25,
                bumpMap: bumpTexture, bumpScale: 0.02,
                emissive: 0x332200, emissiveIntensity: 0.05
            });
            var mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true; mesh.receiveShadow = true;
            group.add(mesh);

            // толстые рёбра
            addThickEdgesForBox(group, l, w, h, 0xFFB347);

            var hl = l/2, hw = w/2, hh = h/2;
            makeLabel('Длина ' + l.toFixed(1) + ' м',
                new THREE.Vector3(0, -hh-1.8, hw+0.8), '#ff6b6b', '📏',
                new THREE.Vector3(0,-hh+0.1,hw), new THREE.Vector3(0,-hh-0.8,hw+0.4),
                scene, labels, edgeLines);
            makeLabel('Ширина ' + w.toFixed(1) + ' м',
                new THREE.Vector3(hl+1.8, -hh-0.8, 0), '#60a5fa', '📐',
                new THREE.Vector3(hl+0.1,-hh+0.1,0), new THREE.Vector3(hl+0.8,-hh-0.4,0),
                scene, labels, edgeLines);
            makeLabel('Высота ' + h.toFixed(1) + ' м',
                new THREE.Vector3(hl+1.6, 0, hw+0.8), '#4ade80', '📐',
                new THREE.Vector3(hl+0.1,0,hw+0.1), new THREE.Vector3(hl+0.6,0,hw+0.4),
                scene, labels, edgeLines);
        },
        applyValues: function(vals) {},
        updateInfo: function() {
            var v = (window._currentVals.L * window._currentVals.W * window._currentVals.H).toFixed(2);
            document.getElementById('infoL').textContent = window._currentVals.L.toFixed(1) + ' м';
            document.getElementById('infoW').textContent = window._currentVals.W.toFixed(1) + ' м';
            document.getElementById('infoH').textContent = window._currentVals.H.toFixed(1) + ' м';
            document.getElementById('infoV').textContent = v + ' м³';
            document.getElementById('formulaL').textContent = window._currentVals.L.toFixed(1);
            document.getElementById('formulaW').textContent = window._currentVals.W.toFixed(1);
            document.getElementById('formulaH').textContent = window._currentVals.H.toFixed(1);
            document.getElementById('ctxL').textContent = window._currentVals.L.toFixed(1);
            document.getElementById('ctxW').textContent = window._currentVals.W.toFixed(1);
            document.getElementById('ctxH').textContent = window._currentVals.H.toFixed(1);
            document.getElementById('ctxV').textContent = v;
            var mixers = Math.ceil(parseFloat(v) / 12);
            document.getElementById('ctxHint').textContent = '(≈ ' + mixers + ' миксер' + (mixers>1?'а':'') + ' по 12 м³)';
        }
    });
};