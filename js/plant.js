// ==========================================
// PLANT SYSTEM - Sistema de Plantas
// ==========================================

class Plant {
    constructor(x, z, cropType) {
        this.x = x;
        this.z = z;
        this.cropType = cropType;
        this.health = 100;
        this.growthStage = 0; // 0-4 (plantio, crescimento, maturação, colheita)
        this.age = 0;
        this.watered = false;
        this.daysWithoutWater = 0;
        this.mesh = null;
        this.selectedDefense = null;

        // Configurações por tipo de cultura
        this.crops = {
            corn: {
                name: '🌽 Milho',
                growthTime: 20,
                sellPrice: 150,
                waterNeeded: 3,
                color: 0xFFD700,
                height: 1.5
            },
            wheat: {
                name: '🌾 Trigo',
                growthTime: 15,
                sellPrice: 120,
                waterNeeded: 2,
                color: 0xF4A460,
                height: 1.0
            },
            soybean: {
                name: '🟫 Soja',
                growthTime: 18,
                sellPrice: 180,
                waterNeeded: 2.5,
                color: 0x8B4513,
                height: 0.8
            }
        };
    }

    getCropData() {
        return this.crops[this.cropType];
    }

    update(deltaTime = 1) {
        const cropData = this.getCropData();

        // Atualizar crescimento
        if (this.growthStage < 4) {
            this.age++;
            const daysToGrow = cropData.growthTime;
            this.growthStage = Math.floor((this.age / daysToGrow) * 4);
        }

        // Gerenciar água
        if (!this.watered) {
            this.daysWithoutWater++;
            if (this.daysWithoutWater > 5) {
                this.health -= 5; // Planta morre sem água
            }
        } else {
            this.daysWithoutWater = 0;
            this.watered = false; // Reset água diária
        }

        // Garantir que health não fique negativo
        this.health = Math.max(0, this.health);
    }

    water() {
        const cropData = this.getCropData();
        this.watered = true;
        this.health = Math.min(100, this.health + 20);
        return true;
    }

    isReady() {
        return this.growthStage === 4 && this.health > 0;
    }

    getDamage(amount) {
        // Verificar se tem defesa
        if (this.selectedDefense) {
            return amount * 0.3; // Defesa reduz dano em 70%
        }
        return amount;
    }

    takeDamage(amount) {
        const actualDamage = this.getDamage(amount);
        this.health -= actualDamage;
        this.health = Math.max(0, this.health);
    }

    getHarvestValue() {
        const cropData = this.getCropData();
        const healthMultiplier = this.health / 100;
        return Math.floor(cropData.sellPrice * healthMultiplier);
    }

    setDefense(defenseType) {
        this.selectedDefense = defenseType;
    }

    getInfo() {
        const cropData = this.getCropData();
        return {
            name: cropData.name,
            growthStage: `${Math.floor((this.growthStage / 4) * 100)}%`,
            health: `${Math.floor(this.health)}%`,
            age: this.age,
            watered: this.watered ? '✅' : '❌',
            daysWithoutWater: this.daysWithoutWater,
            ready: this.isReady() ? '🎉 Pronta!' : '⏳ Crescendo',
            defense: this.selectedDefense || 'Nenhuma'
        };
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Plant;
}
