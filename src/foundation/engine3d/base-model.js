// ==========================================
// BaseModel — абстрактный класс для всех 3D-моделей
// ==========================================

/**
 * Базовый класс, который должны наследовать все конкретные модели.
 * Определяет интерфейс и предоставляет общие методы.
 */
class BaseModel {
    /**
     * @param {Engine3D} engine — ссылка на движок
     * @param {Object} config — конфигурация модели (размеры, цвета, режимы)
     */
    constructor(engine, config = {}) {
        if (new.target === BaseModel) {
            throw new Error('BaseModel нельзя инстанциировать напрямую');
        }
        this.engine = engine;
        this.config = config;
        this.group = new THREE.Group(); // корневая группа, добавляется в сцену
        this.displayMode = 'solid'; // по умолчанию
    }

    /**
     * Создаёт геометрию модели. Переопределяется в наследниках.
     */
    buildGeometry() {
        throw new Error('Метод buildGeometry() должен быть переопределён');
    }

    /**
     * Быстрое обновление геометрии (например, при изменении размеров).
     * По умолчанию вызывает buildGeometry().
     * @param {Object} values — новые значения параметров
     */
    update(values) {
        // Обновляем конфиг
        Object.assign(this.config, values);
        // Удаляем старую геометрию и строим заново (для простоты; можно оптимизировать в наследниках)
        this.clearGroup();
        this.buildGeometry();
    }

    /**
     * Удаляет все дочерние объекты из группы модели.
     */
    clearGroup() {
        while (this.group.children.length > 0) {
            const child = this.group.children[0];
            this.group.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
    }

    /**
     * Переключает режим отображения (solid, transparent, wireframe, blueprint и т.д.)
     * @param {string} mode
     */
    setDisplayMode(mode) {
        this.displayMode = mode;
        // Поведение по умолчанию: перестраиваем геометрию (можно переопределить)
        this.clearGroup();
        this.buildGeometry();
    }

    /**
     * Освобождает ресурсы, занятые моделью.
     */
    dispose() {
        this.clearGroup();
        // Дополнительная очистка может быть добавлена в наследниках
    }
}