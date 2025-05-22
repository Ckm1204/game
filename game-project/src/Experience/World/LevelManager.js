export default class LevelManager {
    constructor(experience) {
        this.experience = experience;
        this.currentLevel = 1;
        this.totalLevels = 2;

        // Posiciones iniciales del robot por nivel
        this.startPositions = {
            1: { x: 0, y: 3, z: 0 },
            2: { x: 5, y: 6, z: 0 }, // Ajusta según la altura del terreno del mundo de hielo
        };
    }

    nextLevel() {
        if (this.currentLevel < this.totalLevels) {
            this.currentLevel++;

            // 🔵 Limpiar escena antes de cargar el nuevo nivel
            this.experience.world.clearCurrentScene();

            // 🔵 Obtener posición inicial del robot para el nuevo nivel
            const startPosition = this.getStartPosition(this.currentLevel);

            // 🔵 Cargar el nivel con la posición adecuada
            this.experience.world.loadLevel(this.currentLevel, startPosition);
        }
    }

    resetLevel() {
        this.currentLevel = 1;

        const startPosition = this.getStartPosition(this.currentLevel);
        this.experience.world.loadLevel(this.currentLevel, startPosition);
    }

    getStartPosition(level) {
        // Fallback de seguridad si no hay una posición definida
        return this.startPositions[level] || { x: 0, y: 5, z: 0 };
    }

    getCurrentLevelTargetPoints() {
        return this.pointsToComplete?.[this.currentLevel] || 2;
    }
}
