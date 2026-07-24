const config = require('../config');

class ContentFilter {
    constructor() {
        this.forbiddenWords = config.forbiddenWords;
    }

    // Check if content contains forbidden words
    checkContent(content) {
        if (!content) return { allowed: true, reason: null };
        
        const lowerContent = content.toLowerCase();
        
        for (const word of this.forbiddenWords) {
            if (lowerContent.includes(word.toLowerCase())) {
                return {
                    allowed: false,
                    reason: `Forbidden content detected: ${word}`
                };
            }
        }
        
        return { allowed: true, reason: null };
    }

    // Check if content is too long
    checkLength(content) {
        if (content && content.length > config.filters.maxMessageLength) {
            return {
                allowed: false,
                reason: `Message exceeds maximum length of ${config.filters.maxMessageLength} characters`
            };
        }
        return { allowed: true, reason: null };
    }

    // Full content check
    validateContent(content) {
        const lengthCheck = this.checkLength(content);
        if (!lengthCheck.allowed) return lengthCheck;

        const contentCheck = this.checkContent(content);
        if (!contentCheck.allowed) return contentCheck;

        return { allowed: true, reason: null };
    }
}

module.exports = ContentFilter;

