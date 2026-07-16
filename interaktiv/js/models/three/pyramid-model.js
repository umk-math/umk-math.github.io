// ==========================================
// ГЕОМЕТРИЧЕСКИЙ ПОСТРОИТЕЛЬ ПИРАМИДЫ (PyramidGeometry)
// ==========================================

const PYRAMID_CONFIG = {
    edgeRadius: 0.08,
    edgeRadiusBlueprint: 0.12,
    edgeColor: 0xFFB347,
    edgeColorBlueprint: 0x000000,
    apothemColor: 0xffaa00,
    apothemColorBlueprint: 0x000000,
    heightLineColor: 0x00ff88,
    tickLength: 0.25,
    tickRadius: 0.06,
    shadowSizeMultiplier: 1.2,
    meshColor: 0xE8C46A,
    meshOpacity: 0.82,
    cylinderSegments: 8,
    blueprintBackground: 0xffffff,
    normalBackground: 0x0a0e14,
};

class PyramidGeometry {
    constructor(scene, bumpTexture) {
        this.scene = scene;
        this.bumpTexture = bumpTexture;
        this.modelGroup = new THREE.Group();
        this.labels = [];
        this.edgeLines = [];
        this.tickMarks = [];
        scene.add(this.modelGroup);

        this.mesh = null;
        this.edgeCylinders = [];
        this.heightLine = null;
        this.apothemLine = null;
        this.contactShadow = null;
    }

    build(a, h, displayMode) {
        this.clear();
        this._createMesh(a, h, displayMode);
        this._createEdges(a, h, displayMode);
        this._createHeightLine(h);
        this._createApothemLine(a, h, displayMode);
        this._createDimensions(a, h, displayMode);
        this._createShadow(a);
        this._applyDisplayMode(displayMode);
    }

    update(a, h, displayMode) {
        if (this.mesh) {
            const half = a / 2;
            const pos = this.mesh.geometry.attributes.position.array;
            pos[0] = half;  pos[1] = 0; pos[2] = half;
            pos[3] = -half; pos[4] = 0; pos[5] = half;
            pos[6] = -half; pos[7] = 0; pos[8] = -half;
            pos[9] = half;  pos[10] = 0; pos[11] = -half;
            pos[12] = 0;    pos[13] = h; pos[14] = 0;
            this.mesh.geometry.attributes.position.needsUpdate = true;
            this.mesh.geometry.computeVertexNormals();
        }
        if (this.edgeCylinders.length === 8) {
            const half = a / 2;
            const base = [
                [-half, 0, -half], [half, 0, -half], [half, 0, half], [-half, 0, half]
            ];
            const apex = [0, h, 0];
            for (let i = 0; i < 4; i++) {
                const next = (i + 1) % 4;
                positionCylinder(this.edgeCylinders[i], base[i], base[next]);
            }
            for (let i = 0; i < 4; i++) {
                positionCylinder(this.edgeCylinders[4 + i], base[i], apex);
            }
        }
        if (this.heightLine) {
            const positions = this.heightLine.geometry.attributes.position.array;
            positions[1] = h;
            this.heightLine.geometry.attributes.position.needsUpdate = true;
            this.heightLine.computeLineDistances();
        }
        if (this.apothemLine) {
            const half = a / 2;
            const pos = this.apothemLine.geometry.attributes.position.array;
            pos[0] = 0; pos[1] = h; pos[2] = 0;
            pos[3] = half; pos[4] = 0; pos[5] = 0;
            this.apothemLine.geometry.attributes.position.needsUpdate = true;
        }
        this._clearLabelsAndTicks();
        this._createDimensions(a, h, displayMode);
        this._updateShadow(a);
        this._applyDisplayMode(displayMode);
    }

    clear() {
        while (this.modelGroup.children.length) {
            const child = this.modelGroup.children[0];
            this.modelGroup.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        }
        this._clearLabelsAndTicks();
        this.mesh = null;
        this.edgeCylinders = [];
        this.heightLine = null;
        this.apothemLine = null;
        this.contactShadow = null;
    }

    dispose() {
        this.clear();
        this.scene.remove(this.modelGroup);
    }

    _clearLabelsAndTicks() {
        this.labels.forEach(l => this.scene.remove(l));
        this.edgeLines.forEach(l => this.scene.remove(l));
        this.labels = [];
        this.edgeLines = [];
        this.tickMarks.forEach(t => this.modelGroup.remove(t));
        this.tickMarks = [];
    }

    _createMesh(a, h, mode) {
        const half = a / 2;
        const vertices = new Float32Array([
             half, 0,  half,
            -half, 0,  half,
            -half, 0, -half,
             half, 0, -half,
             0, h, 0
        ]);
        const indices = [0,1,4, 1,2,4, 2,3,4, 3,0,4, 0,3,2, 0,2,1];
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();

        const mat = new THREE.MeshPhysicalMaterial({
            color: PYRAMID_CONFIG.meshColor,
            metalness: 0.1,
            roughness: 0.15,
            clearcoat: 0.4,
            clearcoatRoughness: 0.05,
            transparent: true,
            opacity: PYRAMID_CONFIG.meshOpacity,
            side: THREE.DoubleSide,
            bumpMap: this.bumpTexture,
            bumpScale: 0.01,
            emissive: 0x110000,
            emissiveIntensity: 0.1
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.modelGroup.add(this.mesh);
    }

    _createEdges(a, h, mode) {
        const half = a / 2;
        const base = [
            [-half, 0, -half], [half, 0, -half], [half, 0, half], [-half, 0, half]
        ];
        const apex = [0, h, 0];
        const isBlueprint = (mode === 'blueprint');
        const radius = isBlueprint ? PYRAMID_CONFIG.edgeRadiusBlueprint : PYRAMID_CONFIG.edgeRadius;
        const color = isBlueprint ? PYRAMID_CONFIG.edgeColorBlueprint : PYRAMID_CONFIG.edgeColor;
        const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 });

        for (let i = 0; i < 4; i++) {
            const next = (i + 1) % 4;
            const cyl = createUnitCylinder(mat, radius);
            positionCylinder(cyl, base[i], base[next]);
            this.edgeCylinders.push(cyl);
            this.modelGroup.add(cyl);
        }
        for (let i = 0; i < 4; i++) {
            const cyl = createUnitCylinder(mat, radius);
            positionCylinder(cyl, base[i], apex);
            this.edgeCylinders.push(cyl);
            this.modelGroup.add(cyl);
        }
    }

    _createHeightLine(h) {
        const points = [new THREE.Vector3(0, h, 0), new THREE.Vector3(0, 0, 0)];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineDashedMaterial({
            color: PYRAMID_CONFIG.heightLineColor,
            dashSize: 0.3,
            gapSize: 0.15
        });
        this.heightLine = new THREE.Line(geom, mat);
        this.heightLine.computeLineDistances();
        this.modelGroup.add(this.heightLine);

        const mid = new THREE.Vector3(0.3, h/2, 0.3);
        makeLabel('h', mid, '#00ff88', '', null, null, this.scene, this.labels, this.edgeLines);
    }

    _createApothemLine(a, h, mode) {
        const half = a / 2;
        const apex = new THREE.Vector3(0, h, 0);
        const midSide = new THREE.Vector3(half, 0, 0);
        const isBlueprint = (mode === 'blueprint');
        const color = isBlueprint ? PYRAMID_CONFIG.apothemColorBlueprint : PYRAMID_CONFIG.apothemColor;

        const geom = new THREE.BufferGeometry().setFromPoints([apex, midSide]);
        const mat = new THREE.LineBasicMaterial({ color });
        this.apothemLine = new THREE.Line(geom, mat);
        this.modelGroup.add(this.apothemLine);

        const midL = new THREE.Vector3(half/2, h/2, 0.2);
        makeLabel('l', midL, '#' + color.toString(16).padStart(6, '0'), '', null, null, this.scene, this.labels, this.edgeLines);
    }

    _createDimensions(a, h, mode) {
        const half = a / 2;
        const isBlueprint = (mode === 'blueprint');
        const colorA = isBlueprint ? '#000000' : '#ff6b6b';
        const colorH = isBlueprint ? '#000000' : '#4ade80';

        const lineStartA = new THREE.Vector3(0, 0, half);
        const lineEndA = new THREE.Vector3(0, -0.4, half + 0.5);
        makeLabel(`a = ${a.toFixed(1)} м`, new THREE.Vector3(0, -0.8, half + 1.2), colorA, '',
            lineStartA, lineEndA, this.scene, this.labels, this.edgeLines);
        addDimensionTick(lineStartA, new THREE.Vector3(0, 0, 1), colorA, this.modelGroup);
        addDimensionTick(lineEndA, new THREE.Vector3(0, 0, 1), colorA, this.modelGroup);

        const lineStartH = new THREE.Vector3(half, 0, half);
        const lineEndH = new THREE.Vector3(half + 0.4, h/2, half + 0.3);
        makeLabel(`h = ${h.toFixed(1)} м`, new THREE.Vector3(half + 1.2, h/2, half + 0.5), colorH, '',
            lineStartH, lineEndH, this.scene, this.labels, this.edgeLines);
        addDimensionTick(lineStartH, new THREE.Vector3(1, 0, 0), colorH, this.modelGroup);
        addDimensionTick(lineEndH, new THREE.Vector3(1, 0, 0), colorH, this.modelGroup);
    }

    _createShadow(a) {
        const size = a * PYRAMID_CONFIG.shadowSizeMultiplier;
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(64,64,0, 64,64,64);
        gradient.addColorStop(0, 'rgba(0,0,0,0.7)');
        gradient.addColorStop(0.4, 'rgba(0,0,0,0.3)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,128,128);
        const texture = new THREE.CanvasTexture(canvas);
        this.contactShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(size, size),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
        );
        this.contactShadow.rotation.x = -Math.PI / 2;
        this.contactShadow.position.y = -0.01;
        this.modelGroup.add(this.contactShadow);
    }

    _updateShadow(a) {
        if (!this.contactShadow) return;
        this.modelGroup.remove(this.contactShadow);
        this.contactShadow.geometry.dispose();
        this.contactShadow.material.dispose();
        this._createShadow(a);
    }

    _applyDisplayMode(mode) {
        if (!this.mesh) return;
        const mat = this.mesh.material;
        switch (mode) {
            case 'solid':
                mat.transparent = false; mat.opacity = 1; mat.wireframe = false;
                this.mesh.visible = true;
                this._setEdgesVisible(true);
                break;
            case 'transparent':
                mat.transparent = true; mat.opacity = PYRAMID_CONFIG.meshOpacity; mat.wireframe = false;
                this.mesh.visible = true;
                this._setEdgesVisible(true);
                break;
            case 'wireframe':
                mat.wireframe = true; mat.transparent = false; mat.opacity = 1;
                this.mesh.visible = true;
                this._setEdgesVisible(false);
                break;
            case 'edges-only':
                this.mesh.visible = false;
                this._setEdgesVisible(true);
                break;
            case 'blueprint':
                this.mesh.visible = false;
                this._setEdgesVisible(true);
                break;
        }
    }

    _setEdgesVisible(visible) {
        this.edgeCylinders.forEach(cyl => cyl.visible = visible);
        if (this.apothemLine) this.apothemLine.visible = visible;
        if (this.heightLine) this.heightLine.visible = visible;
    }
}