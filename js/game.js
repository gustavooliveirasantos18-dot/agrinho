// ==========================================
// GAME - Lógica Principal do Jogo
// ==========================================

class Game {
    constructor() {
        this.money = 5000;
        this.seeds = 50;
        this.water = 100;
        this.day = 1;
        this.season = 'Primavera';
        this.plots = [];
        this.maxPlots = 100;
        this.gridSize = 10;
        
        // Sistemas
        this.plant = new Plant(0, 0, 'corn');
        this.disaster = new Disaster();
        this.defense = new Defense();
        
        // Estado
        this.selectedPlot = null;
        this.gameRunning = true;
        this.gameSpeed = 1; // Dias por segundo
        this.lastDayTime = 0;
    }

    initialize() {
        this.createPlots();
        console.log('🌾 Agro Forte iniciado!');
        console.log(`💰 Dinheiro: R$${this.money}`);
        console.log(`🌱 Sementes: ${this.seeds}`);
    }

    createPlots() {
        // Criar grid de talhões (10x10 = 100 talhões)
        for (let x = 0; x < this.gridSize; x++) {
            for (let z = 0; z < this.gridSize; z++) {
                this.plots.push({
                    id: x * this.gridSize + z,
                    x: (x - this.gridSize / 2) * 2,
                    z: (z - this.gridSize / 2) * 2,
                    plant: null,
                    defense: null,
                    soil: 1.0, // Qualidade do solo (0-1)
                    selected: false
                });
            }
        }
    }

    plantCrop(plotId, cropType) {
        const plot = this.plots[plotId];
        
        if (!plot) {
            return { success: false, message: 'Talhão inválido' };
        }

        if (plot.plant !== null) {
            return { success: false, message: 'Este talhão já tem uma planta' };
        }

        if (this.seeds < 1) {
            return { success: false, message: 'Sementes insuficientes' };
        }

        const plant = new Plant(plot.x, plot.z, cropType);
        plot.plant = plant;
        this.seeds--;
        
        return { 
            success: true, 
            message: `🌱 ${plant.getCropData().name} plantada com sucesso!`
        };
    }

    waterPlot(plotId) {
        const plot = this.plots[plotId];
        
        if (!plot || !plot.plant) {
            return { success: false, message: 'Nenhuma planta neste talhão' };
        }

        if (this.water < 10) {
            return { success: false, message: 'Água insuficiente' };
        }

        plot.plant.water();
        this.water -= 10;
        
        return { 
            success: true, 
            message: `💧 Talhão regado com sucesso!`
        };
    }

    harvestPlot(plotId) {
        const plot = this.plots[plotId];
        
        if (!plot || !plot.plant) {
            return { success: false, message: 'Nenhuma planta neste talhão' };
        }

        if (!plot.plant.isReady()) {
            return { success: false, message: '⏳ Planta ainda não está pronta para colher' };
        }

        const value = plot.plant.getHarvestValue();
        const cropName = plot.plant.getCropData().name;
        
        this.money += value;
        plot.plant = null;
        
        return { 
            success: true, 
            message: `✂️ ${cropName} colhida! Ganhou R$${value}`,
            value: value
        };
    }

    buildDefense(plotId, defenseType) {
        const plot = this.plots[plotId];
        
        if (!plot) {
            return { success: false, message: 'Talhão inválido' };
        }

        const result = this.defense.buildDefense(defenseType, plot.x, plot.z, this.money);
        
        if (result.success) {
            this.money -= result.cost;
            plot.defense = defenseType;
        }
        
        return result;
    }

    updateDay() {
        // Atualizar todas as plantas
        for (let plot of this.plots) {
            if (plot.plant) {
                plot.plant.update();

                // Verificar danos de desastres
                const disasterDamage = this.disaster.getDisasterDamage(plot.x, plot.z);
                if (disasterDamage > 0) {
                    plot.plant.takeDamage(disasterDamage);
                }
            }
        }

        // Atualizar sistemas
        this.disaster.update();
        this.defense.update();
        
        // Regenerar água
        this.water = Math.min(100, this.water + 20);
        
        // Avançar dia
        this.day++;
        this.updateSeason();
        
        // Verificar se há novo desastre
        const newDisaster = this.disaster.checkForDisaster();
        return newDisaster;
    }

    updateSeason() {
        const dayOfYear = this.day % 365;
        if (dayOfYear < 91) this.season = 'Primavera';
        else if (dayOfYear < 182) this.season = 'Verão';
        else if (dayOfYear < 273) this.season = 'Outono';
        else this.season = 'Inverno';
    }

    selectPlot(plotId) {
        if (this.selectedPlot !== null) {
            this.plots[this.selectedPlot].selected = false;
        }
        this.selectedPlot = plotId;
        this.plots[plotId].selected = true;
    }

    getGameStats() {
        return {
            money: this.money,
            seeds: this.seeds,
            water: this.water,
            day: this.day,
            season: this.season,
            plantsCount: this.plots.filter(p => p.plant !== null).length,
            defensesCount: this.defense.defenses.length,
            activeDisasters: this.disaster.activeDisasters.length
        };
    }

    getPlotInfo(plotId) {
        const plot = this.plots[plotId];
        if (!plot) return null;

        return {
            id: plot.id,
            plant: plot.plant ? plot.plant.getInfo() : 'Vazio',
            defense: plot.defense || 'Nenhuma',
            soil: `${Math.floor(plot.soil * 100)}%`
        };
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}
