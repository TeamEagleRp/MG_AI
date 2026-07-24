require('dotenv').config();

module.exports = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    ownerId: process.env.OWNER_ID,
    supportServer: process.env.SUPPORT_SERVER,
    port: process.env.WEBSITE_PORT || 3000,

    // القيود - الكلمات الممنوعة
    forbiddenWords: [
        'hack', 'hacker', 'hacking', 'exploit', 'cheat', 'crack',
        'هكر', 'هكرز', 'اختراق', 'تهكير', 'ثغرات', 'اختراق حسابات',
        'ip logger', 'rat', 'malware', 'virus', 'trojan',
        'اختراق فيسبوك', 'اختراق انستقرام', 'سرقة حسابات',
        'كود تهكير', 'طريقة اختراق', 'اختراق واتساب',
        'telegram hack', 'whatsapp hack', 'instagram hack',
        'hack discord', 'discord hack', 'roblox hack',
        'free nitro', 'nitro generator', 'token grabber',
        'roblox exploit', 'injector', 'ddos', 'boot'
    ],

    // فلاتر المحتوى
    filters: {
        maxMessageLength: 2000,
        cooldownSeconds: 3,
        maxHistoryLength: 50
    },

    // الإعدادات العامة
    settings: {
        botName: 'MG AI',
        botAvatar: 'https://cdn.discordapp.com/avatars/1529487107662418071/logo.png',
        footer: 'MG CoDe',
        color: '#444444',
        version: '1.0.0'
    },

    // اللغات المدعومة
    languages: ['ar', 'en']
};

