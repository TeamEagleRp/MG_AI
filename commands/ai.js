const { 
    SlashCommandBuilder, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle 
} = require('discord.js');
const config = require('../config');

module.exports = {
    // AI Ask command
    ask: {
        data: new SlashCommandBuilder()
            .setName('ask')
            .setNameLocalizations({ 'en-US': 'ask', 'ar-SA': 'اسأل' })
            .setDescription('Ask MG AI a question')
            .setDescriptionLocalizations({
                'en-US': 'Ask MG AI a question',
                'ar-SA': 'اسأل MG AI سؤالاً'
            })
            .addStringOption(option =>
                option.setName('question')
                    .setNameLocalizations({ 'en-US': 'question', 'ar-SA': 'السؤال' })
                    .setDescription('Your question')
                    .setDescriptionLocalizations({
                        'en-US': 'Your question',
                        'ar-SA': 'سؤالك'
                    })
                    .setRequired(true)),

        async execute(interaction, lang, filter, cooldown) {
            const question = interaction.options.getString('question');

            // Check cooldown
            const cooldownCheck = cooldown.check(interaction.user.id);
            if (cooldownCheck.onCooldown) {
                return interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.cooldown', { 
                        seconds: cooldownCheck.remaining 
                    }),
                    ephemeral: true
                });
            }

            // Check content filter
            const contentCheck = filter.validateContent(question);
            if (!contentCheck.allowed) {
                return interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.forbidden_content'),
                    ephemeral: true
                });
            }

            // Set cooldown
            cooldown.set(interaction.user.id);

            await interaction.deferReply();

            try {
                // Local AI responses based on keywords
                const response = await generateAIResponse(question, interaction.user.id, lang);
                
                const embed = new EmbedBuilder()
                    .setColor(config.settings.color)
                    .setAuthor({ 
                        name: `${interaction.user.tag}`, 
                        iconURL: interaction.user.displayAvatarURL() 
                    })
                    .setDescription(`**${question}**\n\n${response}`)
                    .setFooter({ 
                        text: `${config.settings.footer} | ${lang.get(interaction.user.id, 'language_name')}`,
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                await interaction.editReply({
                    content: lang.get(interaction.user.id, 'messages.error')
                });
            }
        }
    }
};

// Local AI response generation (no external API needed)
async function generateAIResponse(question, userId, lang) {
    const lowerQuestion = question.toLowerCase();
    const userLang = lang.getUserLanguage(userId);
    
    // Simple keyword-based responses (can be extended)
    const responses = {
        ar: {
            greetings: ['مرحباً', 'أهلاً', 'السلام عليكم', 'هلا'],
            how_are_you: ['بخير الحمدلله', 'أنا بخير، شكراً لسؤالك!'],
            who_are_you: ['أنا MG AI، بوت ذكاء اصطناعي متكامل تم تطويره بواسطة MG CoDe 🤖'],
            capabilities: ['أستطيع مساعدتك في الإجابة على الأسئلة، إدارة السيرفر، وإنجاز المهام المختلفة!'],
            time: [`الوقت الآن: ${new Date().toLocaleTimeString('ar-SA')}`],
            date: [`التاريخ: ${new Date().toLocaleDateString('ar-SA')}`],
            weather: ['عذراً، لا يمكنني معرفة حالة الطقس حالياً 😅'],
            thanks: ['على الرحب والسعة! 😊', 'لا شكر على واجب!'],
            bot: ['MG AI هو بوت ذكاء اصطناعي من تطوير MG CoDe'],
            server: ['للحصول على معلومات السيرفر استخدم /معلومات-سيرفر'],
            help_response: ['استخدم /مساعدة لرؤية جميع الأوامر المتاحة'],
            default: ['شكراً لسؤالك! أنا MG AI، بوت ذكاء اصطناعي. كيف يمكنني مساعدتك اليوم؟ 🤖']
        },
        en: {
            greetings: ['Hello!', 'Hi there!', 'Hey!', 'Greetings!'],
            how_are_you: ['I\'m doing great, thank you!', 'I\'m fine, thanks for asking!'],
            who_are_you: ['I am MG AI, a complete AI bot developed by MG CoDe 🤖'],
            capabilities: ['I can help you answer questions, manage the server, and perform various tasks!'],
            time: [`Current time: ${new Date().toLocaleTimeString('en-US')}`],
            date: [`Today\'s date: ${new Date().toLocaleDateString('en-US')}`],
            weather: ['Sorry, I cannot check the weather right now 😅'],
            thanks: ['You\'re welcome! 😊', 'Happy to help!', 'My pleasure!'],
            bot: ['MG AI is an AI bot developed by MG CoDe'],
            server: ['Use /serverinfo to get server information'],
            help_response: ['Use /help to see all available commands'],
            default: ['Thank you for your question! I am MG AI, an AI bot. How can I help you today? 🤖']
        }
    };

    const langResponses = responses[userLang] || responses.en;

    // Check for keywords
    if (lowerQuestion.includes('مرحب') || lowerQuestion.includes('اهل') || lowerQuestion.includes('هلا') || lowerQuestion.includes('سلام') || 
        lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey') || lowerQuestion.includes('greeting')) {
        return getRandom(langResponses.greetings);
    }
    
    if (lowerQuestion.includes('كيفك') || lowerQuestion.includes('كيف حالك') || lowerQuestion.includes('how are') || lowerQuestion.includes('how do you do')) {
        return getRandom(langResponses.how_are_you);
    }
    
    if (lowerQuestion.includes('من انت') || lowerQuestion.includes('من تكون') || lowerQuestion.includes('what are you') || lowerQuestion.includes('who are you') || lowerQuestion.includes('your name')) {
        return langResponses.who_are_you;
    }
    
    if (lowerQuestion.includes('ماذا تستطيع') || lowerQuestion.includes('ماذا يمكنك') || lowerQuestion.includes('what can you') || lowerQuestion.includes('capabilities') || lowerQuestion.includes('features')) {
        return langResponses.capabilities;
    }
    
    if (lowerQuestion.includes('الوقت') || lowerQuestion.includes('الساعة') || lowerQuestion.includes('كم الساعة') || lowerQuestion.includes('what time') || lowerQuestion.includes('current time') || lowerQuestion.includes('clock')) {
        return langResponses.time;
    }
    
    if (lowerQuestion.includes('التاريخ') || lowerQuestion.includes('اليوم') || lowerQuestion.includes('what date') || lowerQuestion.includes('today date') || lowerQuestion.includes('current date')) {
        return langResponses.date;
    }
    
    if (lowerQuestion.includes('الطقس') || lowerQuestion.includes('الجو') || lowerQuestion.includes('weather') || lowerQuestion.includes('temperature') || lowerQuestion.includes('rain')) {
        return langResponses.weather;
    }
    
    if (lowerQuestion.includes('شكر') || lowerQuestion.includes('thank') || lowerQuestion.includes('thanks') || lowerQuestion.includes('appreciate')) {
        return getRandom(langResponses.thanks);
    }
    
    if (lowerQuestion.includes('bot') || lowerQuestion.includes('بوت') || lowerQuestion.includes('mg ai')) {
        return langResponses.bot;
    }
    
    if (lowerQuestion.includes('سيرفر') || lowerQuestion.includes('server') || lowerQuestion.includes('guild')) {
        return langResponses.server;
    }
    
    if (lowerQuestion.includes('help') || lowerQuestion.includes('مساعدة') || lowerQuestion.includes('اوامر') || lowerQuestion.includes('commands') || lowerQuestion.includes('قائمة')) {
        return langResponses.help_response;
    }

    // Default response with context awareness
    return langResponses.default;
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

