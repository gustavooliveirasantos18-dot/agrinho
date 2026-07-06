// ==========================================
// UI - Interface do Usuário
// ==========================================

class UI {
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.alerts = [];
        this.initElements();
    }

    initElements() {
        // Recursos
        this.elements.money = document.getElementById('money');
        this.elements.seeds = document.getElementById('seeds');
        this.elements.water = document.getElementById('water');
        
        // Estatísticas
        this.elements.day = document.getElementById('day');
        this.elements.season = document.getElementById('season');
        this.elements.plots = document.getElementById('plots');
        
        // Botões de ação
        this.elements.btnPlant = document.getElementById('btn-plant');
        this.elements.btnWater = document.getElementById('btn-water');
        this.elements.btnHarvest = document.getElementById('btn-harvest');
        this.elements.btnBuildDefense = document.getElementById('btn-build-defense');
        
        // Seletores
        this.elements.cropSelector = document.getElementById('crop-selector');
        this.elements.defenseSelector = document.getElementById('defense-selector');
        this.elements.plotInfo = document.getElementById('plot-info');
        this.elements.infoContent = document.getElementById('info-content');
        this.elements.alertsContainer = document.getElementById('alerts');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Botões de ação
        this.elements.btnPlant.addEventListener('click', () => this.showCropSelector());
        this.elements.btnWater.addEventListener('click', () => this.waterSelectedPlot());
        this.elements.btnHarvest.addEventListener('click', () => this.harvestSelectedPlot());
        this.elements.btnBuildDefense.addEventListener('click', () => this.showDefenseSelector());
        
        // Seletor de culturas
        const cropButtons = this.elements.cropSelector.querySelectorAll('.crop-btn');
        cropButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.plantSelectedCrop(e.target.dataset.crop));
        });
        
        // Seletor de defesas
        const defenseButtons = this.elements.defenseSelector.querySelectorAll('.defense-btn');
        defenseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.buildSelectedDefense(e.target.dataset.defense));
        });
    }

    showCropSelector() {
        if (!this.game.selectedPlot !== null) {
            this.addAlert('Selecione um talhão primeiro!', 'warning');
            return;
        }
        
        if (this.game.seeds < 1) {
            this.addAlert('Você não tem sementes!', 'danger');
            return;
        }
        
        this.toggleElement(this.elements.cropSelector);
    }

    plantSelectedCrop(cropType) {
        if (this.game.selectedPlot === null) {
            this.addAlert('Nenhum talhão selecionado!', 'warning');
            return;
        }
        
        const result = this.game.plantCrop(this.game.selectedPlot, cropType);
        
        if (result.success) {
            this.addAlert(result.message, 'success');
            this.toggleElement(this.elements.cropSelector);
        } else {
            this.addAlert(result.message, 'warning');
        }
        
        this.updateUI();
    }

    waterSelectedPlot() {
        if (this.game.selectedPlot === null) {
            this.addAlert('Nenhum talhão selecionado!', 'warning');
            return;
        }
        
        const result = this.game.waterPlot(this.game.selectedPlot);
        
        if (result.success) {
            this.addAlert(result.message, 'success');
        } else {
            this.addAlert(result.message, 'warning');
        }
        
        this.updateUI();
    }

    harvestSelectedPlot() {
        if (this.game.selectedPlot === null) {
            this.addAlert('Nenhum talhão selecionado!', 'warning');
            return;
        }
        
        const result = this.game.harvestPlot(this.game.selectedPlot);
        
        if (result.success) {
            this.addAlert(result.message, 'success');
        } else {
            this.addAlert(result.message, 'warning');
        }
        
        this.updateUI();
    }

    showDefenseSelector() {
        if (this.game.selectedPlot === null) {
            this.addAlert('Selecione um talhão primeiro!', 'warning');
            return;
        }
        
        this.toggleElement(this.elements.defenseSelector);
    }

    buildSelectedDefense(defenseType) {
        if (this.game.selectedPlot === null) {
            this.addAlert('Nenhum talhão selecionado!', 'warning');
            return;
        }
        
        const result = this.game.buildDefense(this.game.selectedPlot, defenseType);
        
        if (result.success) {
            this.addAlert(result.message, 'success');
            this.toggleElement(this.elements.defenseSelector);
        } else {
            this.addAlert(result.message, 'warning');
        }
        
        this.updateUI();
    }

    updateUI() {
        const stats = this.game.getGameStats();
        
        // Atualizar recursos
        this.elements.money.textContent = `R$${stats.money}`;
        this.elements.seeds.textContent = stats.seeds;
        this.elements.water.textContent = `${Math.floor(stats.water)}%`;
        
        // Atualizar estatísticas
        this.elements.day.textContent = stats.day;
        this.elements.season.textContent = stats.season;
        this.elements.plots.textContent = `${stats.plantsCount}/100`;
        
        // Atualizar info do talhão selecionado
        if (this.game.selectedPlot !== null) {
            const plotInfo = this.game.getPlotInfo(this.game.selectedPlot);
            this.showPlotInfo(plotInfo);
        }
    }

    showPlotInfo(plotInfo) {
        if (!plotInfo) return;
        
        const plantInfo = plotInfo.plant;
        let content = '';
        
        if (typeof plantInfo === 'string') {
            content = `<p>${plantInfo}</p>`;
        } else {
            content = `
                <p><strong>${plantInfo.name}</strong></p>
                <p>Crescimento: ${plantInfo.growthStage}</p>
                <p>Saúde: ${plantInfo.health}</p>
                <p>Dias sem água: ${plantInfo.daysWithoutWater}</p>
                <p>Status: ${plantInfo.ready}</p>
                <p>Defesa: ${plantInfo.defense}</p>
            `;
        }
        
        this.elements.infoContent.innerHTML = content;
        this.elements.plotInfo.classList.remove('hidden');
    }

    addAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        
        this.elements.alertsContainer.appendChild(alert);
        
        // Remover alert após 3 segundos
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    toggleElement(element) {
        element.classList.toggle('hidden');
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
