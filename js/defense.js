// ==========================================
// DEFENSE SYSTEM - Sistema de Defesas
// ==========================================

class Defense {
    constructor() {
        this.defenses = [];
        this.defenseTypes = {
            lightning: {
                name: '⚡ Pára-raios',
                icon: '⚡',
                cost: 500,
                protection: 'tornado',
                range: 4,
                efficiency: 0.8, // Reduz dano em 80%
                duration: -1, // Permanente
                description: 'Protege contra tornados'
            },
            dam: {
                name: '🌊 Dique',
                icon: '🌊',
                cost: 800,
                protection: 'flood',
                range: 6,
                efficiency: 0.85,
                duration: -1,
                description: 'Protege contra inundações'
            },
            irrigation: {
                name: '💧 Sistema de Irrigação',
                icon: '💧',
                cost: 600,
                protection: 'drought',
                range: 5,
                efficiency: 0.9,
                duration: -1,
                description: 'Protege contra secas'
            },
            greenhouse: {
                name: '🏠 Estufa',
                icon: '🏠',
                cost: 700,
                protection: 'frost',
                range: 3,
                efficiency: 0.88,
                duration: -1,
                description: 'Protege contra geadas'
            },
            pesticide: {
                name: '🧪 Pesticida',
                icon: '🧪',
                cost: 400,
                protection: 'pest',
                range: 4,
                efficiency: 0.75,
                duration: 10, // Durável por 10 dias
                description: 'Protege contra pragas'
            }
        };
    }

    buildDefense(type, x, z, money) {
        const defenseData = this.defenseTypes[type];
        
        if (!defenseData) {
            return { success: false, message: 'Tipo de defesa inválido' };
        }

        if (money < defenseData.cost) {
            return { success: false, message: `Dinheiro insuficiente. Custa R$${defenseData.cost}` };
        }

        const newDefense = {
            type: type,
            data: defenseData,
            x: x,
            z: z,
            age: 0,
            active: true
        };

        this.defenses.push(newDefense);
        return { 
            success: true, 
            message: `${defenseData.name} construída com sucesso!`,
            cost: defenseData.cost
        };
    }

    update() {
        for (let defense of this.defenses) {
            if (defense.data.duration > 0) {
                defense.age++;
                if (defense.age >= defense.data.duration) {
                    defense.active = false;
                }
            }
        }

        // Remover defesas inativas
        this.defenses = this.defenses.filter(d => d.active);
    }

    getProtection(disasterType, plantX, plantZ) {
        let totalProtection = 0;

        for (let defense of this.defenses) {
            if (defense.data.protection === disasterType && defense.active) {
                const distance = Math.sqrt(
                    Math.pow(plantX - defense.x, 2) + 
                    Math.pow(plantZ - defense.z, 2)
                );

                if (distance < defense.data.range) {
                    totalProtection = Math.max(totalProtection, defense.data.efficiency);
                }
            }
        }

        return totalProtection;
    }

    getDefenseInfo() {
        if (this.defenses.length === 0) {
            return 'Nenhuma defesa construída';
        }
        return this.defenses.map(d => 
            `${d.data.name} (${d.active ? '✅' : '❌'})`
        ).join(', ');
    }

    getDefenseStats() {
        const stats = {};
        for (let key of Object.keys(this.defenseTypes)) {
            stats[key] = 0;
        }

        for (let defense of this.defenses) {
            if (defense.active) {
                stats[defense.type]++;
            }
        }

        return stats;
    }

    removeDefenseAt(x, z) {
        this.defenses = this.defenses.filter(d => 
            !(Math.abs(d.x - x) < 0.5 && Math.abs(d.z - z) < 0.5)
        );
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Defense;
}
