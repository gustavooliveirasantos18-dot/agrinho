// ==========================================
// DISASTER SYSTEM - Sistema de Desastres
// ==========================================

class Disaster {
    constructor() {
        this.activeDisasters = [];
        this.disasterTypes = {
            tornado: {
                name: '🌪️ Tornado',
                chance: 0.05,
                damage: 100,
                radius: 5,
                duration: 3,
                color: 0x696969
            },
            flood: {
                name: '💧 Inundação',
                chance: 0.04,
                damage: 80,
                radius: 8,
                duration: 5,
                color: 0x4169E1
            },
            drought: {
                name: '🌞 Seca',
                chance: 0.06,
                damage: 60,
                radius: 10,
                duration: 7,
                color: 0xFFD700
            },
            frost: {
                name: '❄️ Geada',
                chance: 0.03,
                damage: 70,
                radius: 4,
                duration: 4,
                color: 0xB0E0E6
            },
            pest: {
                name: '🐛 Praga',
                chance: 0.07,
                damage: 50,
                radius: 6,
                duration: 6,
                color: 0x8B4513
            }
        };
    }

    checkForDisaster() {
        const rand = Math.random();
        const disasterKeys = Object.keys(this.disasterTypes);

        for (let key of disasterKeys) {
            const disaster = this.disasterTypes[key];
            if (rand < disaster.chance) {
                this.triggerDisaster(key);
                return key;
            }
        }
        return null;
    }

    triggerDisaster(type) {
        const disaster = this.disasterTypes[type];
        const newDisaster = {
            type: type,
            data: disaster,
            age: 0,
            x: Math.random() * 20 - 10,
            z: Math.random() * 20 - 10
        };
        this.activeDisasters.push(newDisaster);
        return newDisaster;
    }

    update() {
        // Remover desastres que expiraram
        this.activeDisasters = this.activeDisasters.filter(d => {
            d.age++;
            return d.age < d.data.duration;
        });
    }

    getDisasterDamage(plantX, plantZ) {
        let totalDamage = 0;

        for (let disaster of this.activeDisasters) {
            const distance = Math.sqrt(
                Math.pow(plantX - disaster.x, 2) + 
                Math.pow(plantZ - disaster.z, 2)
            );

            if (distance < disaster.data.radius) {
                // Dano inversamente proporcional à distância
                const damageMultiplier = 1 - (distance / disaster.data.radius);
                totalDamage += disaster.data.damage * damageMultiplier;
            }
        }

        return totalDamage;
    }

    hasActiveDisaster() {
        return this.activeDisasters.length > 0;
    }

    getActiveDisasterInfo() {
        if (this.activeDisasters.length === 0) {
            return 'Nenhum desastre ativo';
        }
        return this.activeDisasters.map(d => 
            `${d.data.name} (${d.data.duration - d.age} dias)`
        ).join(', ');
    }

    getDisastersByType() {
        const count = {};
        for (let key of Object.keys(this.disasterTypes)) {
            count[key] = 0;
        }
        
        for (let disaster of this.activeDisasters) {
            count[disaster.type]++;
        }
        
        return count;
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Disaster;
}
