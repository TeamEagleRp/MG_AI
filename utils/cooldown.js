const config = require('../config');

class CooldownManager {
    constructor() {
        this.cooldowns = new Map();
    }

    check(userId) {
        const now = Date.now();
        const cooldown = this.cooldowns.get(userId);
        
        if (cooldown && cooldown > now) {
            const remaining = Math.ceil((cooldown - now) / 1000);
            return { onCooldown: true, remaining };
        }
        
        return { onCooldown: false, remaining: 0 };
    }

    set(userId) {
        const now = Date.now();
        this.cooldowns.set(userId, now + (config.filters.cooldownSeconds * 1000));
        
        // Auto cleanup after cooldown expires
        setTimeout(() => {
            this.cooldowns.delete(userId);
        }, config.filters.cooldownSeconds * 1000);
    }
}

module.exports = CooldownManager;

