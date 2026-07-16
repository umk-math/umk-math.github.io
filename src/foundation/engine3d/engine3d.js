// ==========================================
// Engine3D — ядро трёхмерного движка MSF Platform
// ==========================================

/**
 * Главный класс 3D-движка. Управляет сценой, камерой, рендерером и освещением.
 * Предоставляет методы для добавления/удаления моделей.
 */
class Engine3D {
    /**
     * @param {string} containerId — ID HTML-элемента, куда будет вставлен canvas
     * @param {Object} config — настройки
     * @param {number[]} config.cameraPos — позиция камеры [x, y, z]
     * @param {string|number} config.background — цвет фона сцены
     */
    constructor(containerId, config = {}) {
        const container = document.getElementById(containerId);
        if (!container) throw new Error(`Engine3D: контейнер #${containerId} не найден`);

        this.container = container;
        this.config = config;

        // Инициализация основных компонентов
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(config.background || 0x0a0e14);

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 400;

        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        this.camera.position.set(
            config.cameraPos?.[0] || 9,
            config.cameraPos?.[1] || 7,
            config.cameraPos?.[2] || 11
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);

        // OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.autoRotate = false;

        // Освещение (трёхточечная схема)
        this._initLights();

        // Модели
        this.models = [];

        // Запуск рендер-цикла
        this._animate = this._animate.bind(this);
        this._animate();

        // Ресайз
        window.addEventListener('resize', () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        });

        // Сохраняем ссылку на Engine в контейнере (для доступа извне)
        container._engine3d = this;
    }

    _initLights() {
        // Ambient
        this.scene.add(new THREE.AmbientLight(0x404060, 0.5));
        // Hemisphere
        this.scene.add(new THREE.HemisphereLight(0xdddddd, 0x112233, 0.7));
        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
        keyLight.position.set(12, 22, 18);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        this.scene.add(keyLight);
        // Rim light
        const rimLight = new THREE.DirectionalLight(0x99ccff, 1.0);
        rimLight.position.set(-18, 8, -16);
        this.scene.add(rimLight);
    }

    _animate() {
        requestAnimationFrame(this._animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Добавляет модель в сцену.
     * @param {BaseModel} model — экземпляр BaseModel
     */
    addModel(model) {
        if (!(model instanceof BaseModel)) {
            throw new Error('Engine3D.addModel: объект должен быть экземпляром BaseModel');
        }
        this.models.push(model);
        this.scene.add(model.group); // model.group — корневая группа модели
    }

    /**
     * Удаляет модель из сцены и освобождает её ресурсы.
     * @param {BaseModel} model
     */
    removeModel(model) {
        const index = this.models.indexOf(model);
        if (index !== -1) {
            this.models.splice(index, 1);
            model.dispose();
            this.scene.remove(model.group);
        }
    }

    /**
     * Меняет фон сцены.
     * @param {string|number} color
     */
    setBackground(color) {
        this.scene.background = new THREE.Color(color);
    }

    /**
     * Полностью очищает движок: удаляет все модели, сцену, рендерер.
     */
    dispose() {
        // Удаляем все модели
        while (this.models.length > 0) {
            this.removeModel(this.models[0]);
        }
        // Очищаем сцену
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        // Удаляем рендерер
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        // Останавливаем анимацию (просто перестаём ссылаться)
        this._animate = null;
    }
}