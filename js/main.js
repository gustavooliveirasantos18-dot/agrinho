// ==========================================
// MAIN - Inicialização Principal
// ==========================================

let game;
let ui;
let gameTime = 0;

// Inicializar o jogo quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    console.log('🌾 Agro Forte está carregando...');
    
    // Criar instâncias dos sistemas
    game = new Game();
    ui = new UI(game);
    
    // Inicializar jogo
    game.initialize();
    ui.updateUI();
    
    // Loop do jogo
    setInterval(() => {
        gameTime++;
        
        // A cada 1 segundo = 1 dia de jogo
        if (gameTime % 1 === 0) {
            const disasterTriggered = game.updateDay();
            
            if (disasterTriggered) {
                ui.addAlert(`⚠️ ${game.disaster.disasterTypes[disasterTriggered].name} chegando!`, 'danger');
            }
            
            ui.updateUI();
        }
    }, 1000);
    
    // Canvas (placeholder para 3D)
    const canvas = document.getElementById('canvas');
    if (canvas) {
        canvas.style.background = 'linear-gradient(to bottom, #87CEEB, #90EE90)';
        const ctx = canvas.getContext('2d');
        
        // Simples renderização 2D dos talhões
        function drawGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Desenhar grid de talhões
            const cellSize = canvas.width / game.gridSize;
            
            for (let i = 0; i < game.plots.length; i++) {
                const plot = game.plots[i];
                const x = (plot.x + (game.gridSize / 2) * 2) / 2;
                const y = (plot.z + (game.gridSize / 2) * 2) / 2;
                
                // Cor do talhão
                if (plot.selected) {
                    ctx.fillStyle = '#FFD700';
                } else if (plot.plant) {
                    ctx.fillStyle = '#90EE90';
                } else {
                    ctx.fillStyle = '#D2B48C';
                }
                
                ctx.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
                
                // Desenhar planta se existir
                if (plot.plant) {
                    ctx.fillStyle = '#228B22';
                    ctx.beginPath();
                    ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Desenhar defesa se existir
                if (plot.defense) {
                    ctx.fillStyle = '#FF6347';
                    ctx.fillRect(x * cellSize + cellSize / 4, y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
                }
            }
            
            // Desenhar desastres ativos
            ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
            for (let disaster of game.disaster.activeDisasters) {
                const x = (disaster.x + (game.gridSize / 2) * 2) / 2;
                const y = (disaster.z + (game.gridSize / 2) * 2) / 2;
                const radius = disaster.data.radius * cellSize / 2;
                
                ctx.beginPath();
                ctx.arc(x * cellSize, y * cellSize, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            requestAnimationFrame(drawGame);
        }
        
        // Evento de clique no canvas para selecionar talhões
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / (canvas.width / game.gridSize);
            const y = (e.clientY - rect.top) / (canvas.height / game.gridSize);
            
            const plotId = Math.floor(y) * game.gridSize + Math.floor(x);
            
            if (plotId >= 0 && plotId < game.plots.length) {
                game.selectPlot(plotId);
                ui.updateUI();
                ui.addAlert(`Talhão ${plotId} selecionado!`, 'info');
            }
        });
        
        drawGame();
    }
    
    console.log('✅ Agro Forte carregado com sucesso!');
});

// Função auxiliar para debug
window.gameDebug = () => {
    console.log('=== AGRO FORTE DEBUG ===')
    console.log('Dinheiro:', game.money);
    console.log('Sementes:', game.seeds);
    console.log('Água:', game.water);
    console.log('Dia:', game.day);
    console.log('Plantas:', game.plots.filter(p => p.plant).length);
    console.log('Defesas:', game.defense.defenses.length);
    console.log('Desastres ativos:', game.disaster.activeDisasters.length);
};
