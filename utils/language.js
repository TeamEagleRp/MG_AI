const fs = require('fs');
const path = require('path');

class LanguageManager {
    constructor() {
        this.languages = {};
        this.userLanguages = new Map(); // userId -> language code
        this.loadLanguages();
    }

    loadLanguages() {
        const langDir = path.join(__dirname, '..', 'languages');
        const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const langCode = file.split('.')[0];
            const langData = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8'));
            this.languages[langCode] = langData;
        }
    }

    getUserLanguage(userId) {
        return this.userLanguages.get(userId) || 'ar'; // Default to Arabic
    }

    setUserLanguage(userId, langCode) {
        if (this.languages[langCode]) {
            this.userLanguages.set(userId, langCode);
            return true;
        }
        return false;
    }

    get(userId, key, params = {}) {
        const langCode = this.getUserLanguage(userId);
        const lang = this.languages[langCode] || this.languages['ar'];
        
        // Split key by dots to get nested value
        const keys = key.split('.');
        let value = lang;
        for (const k of keys) {
            if (!value || !value[k]) {
                // Fallback to Arabic
                let fallback = this.languages['ar'];
                for (const fk of keys) {
                    fallback = fallback?.[fk];
                }
                value = fallback || key;
                break;
            }
            value = value[k];
        }

        // Replace params
        if (typeof value === 'string') {
            for (const [paramKey, paramValue] of Object.entries(params)) {
                value = value.replace(`{${paramKey}}`, paramValue);
            }
        }

        return value;
    }

    getCommandName(userId, commandKey) {
        const langCode = this.getUserLanguage(userId);
        const lang = this.languages[langCode] || this.languages['ar'];
        return lang.commands?.[commandKey]?.name || commandKey;
    }

    getCommandDescription(userId, commandKey) {
        const langCode = this.getUserLanguage(userId);
        const lang = this.languages[langCode] || this.languages['ar'];
        return lang.commands?.[commandKey]?.description || '';
    }
}

module.exports = LanguageManager;

