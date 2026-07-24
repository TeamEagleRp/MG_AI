// =============================================
// MG AI - Internationalization (i18n) Utilities
// Copyright: MG CoDe | Version: 444
// =============================================

/**
 * MG AI i18n Module
 * Provides translation loading, language switching,
 * and text replacement utilities for the standalone website.
 */

const MG_AI_I18N = {
    currentLang: localStorage.getItem('mg-ai-lang') || 'ar',
    translations: {},
    botInfo: {},

    /**
     * Load translations from server or local fallback
     * @param {string} lang - Language code ('ar' or 'en')
     * @returns {Promise<boolean>} Whether loading succeeded
     */
    async loadTranslations(lang) {
        const toggleBtn = document.getElementById('langToggle');
        if (toggleBtn) toggleBtn.disabled = true;

        try {
            const res = await fetch(`/api/translations?lang=${lang}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            this.translations = data.translations || {};
            this.botInfo = {
                botName: data.botName || 'MG AI',
                botVersion: data.botVersion || 'v1.0.0',
                supportServer: data.supportServer || ''
            };
            this.currentLang = data.lang || lang;
            this.applyTranslations();
            localStorage.setItem('mg-ai-lang', this.currentLang);
            return true;
        } catch (err) {
            console.warn('[i18n] Server load failed, trying local fallback:', err);
            return this.loadLocalFallback(lang);
        } finally {
            if (toggleBtn) toggleBtn.disabled = false;
        }
    },

    /**
     * Load translations from local JSON files as fallback
     * @param {string} lang - Language code
     * @returns {Promise<boolean>}
     */
    async loadLocalFallback(lang) {
        try {
            const res = await fetch(`locales/${lang}.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            this.translations = data.translations || {};
            this.botInfo = {
                botName: data.botName || 'MG AI',
                botVersion: data.botVersion || 'v1.0.0',
                supportServer: data.supportServer || ''
            };
            this.currentLang = data.lang || lang;
            this.applyTranslations();
            localStorage.setItem('mg-ai-lang', this.currentLang);
            return true;
        } catch (err) {
            console.error('[i18n] Local fallback also failed:', err);
            return false;
        }
    },

    /**
     * Apply translations to all elements with data-i18n attributes
     */
    applyTranslations() {
        if (!this.translations || Object.keys(this.translations).length === 0) return;

        // Set document direction
        document.body.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = this.currentLang;

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[key]) {
                el.textContent = this.translations[key];
            }
        });

        // Update language toggle button
        const flagEl = document.getElementById('langFlag');
        const labelEl = document.getElementById('langLabel');

        if (this.currentLang === 'ar') {
            if (flagEl) flagEl.textContent = '🇬🇧';
            if (labelEl) labelEl.textContent = 'English';
        } else {
            if (flagEl) flagEl.textContent = '🇸🇦';
            if (labelEl) labelEl.textContent = 'العربية';
        }

        // Update document title
        if (this.translations.dashboardTitle) {
            document.title = `MG AI - ${this.translations.dashboardTitle}`;
        }

        // Trigger custom event for other scripts
        document.dispatchEvent(new CustomEvent('i18n:applied', {
            detail: { lang: this.currentLang, translations: this.translations }
        }));
    },

    /**
     * Toggle between Arabic and English
     */
    toggleLanguage() {
        const nextLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.loadTranslations(nextLang);
    },

    /**
     * Get a translated value by key
     * @param {string} key - Translation key
     * @param {Object} params - Optional replacement parameters
     * @returns {string}
     */
    t(key, params = {}) {
        let value = this.translations[key] || key;
        for (const [k, v] of Object.entries(params)) {
            value = value.replace(`{${k}}`, v);
        }
        return value;
    },

    /**
     * Initialize i18n system
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            const toggleBtn = document.getElementById('langToggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggleLanguage());
            }
            this.loadTranslations(this.currentLang);
        });
    }
};

// Auto-initialize
MG_AI_I18N.init();

// Export for use in other scripts
window.MG_AI_I18N = MG_AI_I18N;

