const { EmbedBuilder } = require('discord.js');
const config = require('../config');

class EmbedBuilderUtil {
    constructor(languageManager) {
        this.lang = languageManager;
    }

    createDefault(userId) {
        return new EmbedBuilder()
            .setColor(config.settings.color)
            .setFooter({ 
                text: config.settings.footer, 
                iconURL: config.settings.botAvatar 
            })
            .setTimestamp();
    }

    createError(userId, message) {
        return this.createDefault(userId)
            .setColor('#FF0000')
            .setDescription(message);
    }

    createSuccess(userId, message) {
        return this.createDefault(userId)
            .setColor('#00FF00')
            .setDescription(message);
    }

    createInfo(userId, title, description) {
        return this.createDefault(userId)
            .setColor(config.settings.color)
            .setTitle(title)
            .setDescription(description);
    }

    createHelpEmbed(userId, commands) {
        const embed = this.createDefault(userId)
            .setTitle(this.lang.get(userId, 'messages.help_title'))
            .setColor(config.settings.color)
            .setFooter({ 
                text: this.lang.get(userId, 'messages.help_footer'),
                iconURL: config.settings.botAvatar
            });

        for (const [category, cmds] of Object.entries(commands)) {
            let categoryName = '';
            switch(category) {
                case 'ai': categoryName = this.lang.get(userId, 'messages.help_ai'); break;
                case 'admin': categoryName = this.lang.get(userId, 'messages.help_admin'); break;
                case 'utility': categoryName = this.lang.get(userId, 'messages.help_utility'); break;
                case 'fun': categoryName = this.lang.get(userId, 'messages.help_fun'); break;
                default: categoryName = category;
            }
            
            if (cmds.length > 0) {
                embed.addFields({
                    name: categoryName,
                    value: cmds.join('\n'),
                    inline: false
                });
            }
        }

        return embed;
    }
}

module.exports = EmbedBuilderUtil;

