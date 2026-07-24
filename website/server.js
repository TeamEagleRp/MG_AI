const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const config = require('../config');

const app = express();
const PORT = config.port || 3000;

// ============================================
// Simulated Bot Stats (will be replaced with real data from bot)
// ============================================
let botStats = {
    servers: 12,
    users: 2847,
    commandsExecuted: 45231,
    uptime: '14d 7h 32m',
    latency: '42ms',
    startTime: Date.now(),
    commandsByCategory: {
        ai: { count: 15234, enabled: true },
        admin: { count: 18456, enabled: true },
        utility: { count: 11541, enabled: true }
    },
    topServers: [
        { id: '1', name: 'MG AI Community', members: 1245, commands: 8754 },
        { id: '2', name: 'Developers Hub', members: 892, commands: 5632 },
        { id: '3', name: 'Gaming Zone', members: 456, commands: 3210 },
        { id: '4', name: 'Support Server', members: 254, commands: 1890 }
    ],
    recentActivity: [
        { type: 'command', action: '/ask', user: 'User#1234', server: 'MG AI', time: '2m ago' },
        { type: 'command', action: '/clear', user: 'Admin#5678', server: 'Dev Hub', time: '5m ago' },
        { type: 'command', action: '/kick', user: 'Mod#9012', server: 'Gaming', time: '10m ago' },
        { type: 'join', action: 'Bot Joined', user: 'System', server: 'New Server', time: '15m ago' },
        { type: 'command', action: '/serverinfo', user: 'User#3456', server: 'MG AI', time: '20m ago' }
    ],
    botGuilds: []
};

// Update uptime every minute
setInterval(() => {
    const diff = Date.now() - botStats.startTime;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    botStats.uptime = `${days}d ${hours}h ${mins}m`;
}, 60000);

// ============================================
// Environment Validation
// ============================================
const requiredEnvVars = [
    'DISCORD_TOKEN',
    'CLIENT_ID',
    'DISCORD_CLIENT_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('📝 Please create a .env file based on .env.example');
    process.exit(1);
}

// Discord OAuth2 credentials from environment variables
const DISCORD_CLIENT_ID = process.env.CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = `http://localhost:${PORT}/auth/discord/callback`;

// Session middleware
const sessionSecret = process.env.SESSION_SECRET || `mg-ai-session-${Date.now()}`;
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true if HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../'))); // Serve root for dashboard-pro.html

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// ROUTES
// ============================================

// Home page
app.get('/', (req, res) => {
    const user = req.session.user || null;
    const lang = req.session.lang || 'ar';
    res.render('index', { 
        user, 
        lang,
        config: {
            clientId: DISCORD_CLIENT_ID,
            supportServer: config.supportServer,
            botName: config.settings.botName,
            botAvatar: config.settings.botAvatar
        }
    });
});

// Dashboard (EJS)
app.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const lang = req.session.lang || 'ar';
    const user = req.session.user;

    try {
        const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`
            }
        });

        const userGuilds = guildsResponse.data;
        
        const manageableGuilds = userGuilds.filter(guild => {
            const permissions = BigInt(guild.permissions);
            return (permissions & BigInt(0x8)) === BigInt(0x8) || (permissions & BigInt(0x20)) === BigInt(0x20);
        });

        res.render('dashboard', {
            user,
            guilds: userGuilds,
            manageableGuilds,
            lang,
            config: {
                clientId: DISCORD_CLIENT_ID,
                supportServer: config.supportServer,
                botName: config.settings.botName
            },
            stats: botStats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('dashboard', {
            user,
            guilds: [],
            manageableGuilds: [],
            lang,
            config: {
                clientId: DISCORD_CLIENT_ID,
                supportServer: config.supportServer,
                botName: config.settings.botName
            },
            stats: botStats
        });
    }
});

// New Advanced Dashboard Page (HTML)
app.get('/dashboard-pro', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const lang = req.session.lang || 'ar';
    const user = req.session.user;
    let userGuilds = [];
    let manageableGuilds = [];

    try {
        const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${req.session.accessToken}`
            }
        });

        userGuilds = guildsResponse.data;
        
        manageableGuilds = userGuilds.filter(guild => {
            const permissions = BigInt(guild.permissions);
            return (permissions & BigInt(0x8)) === BigInt(0x8) || (permissions & BigInt(0x20)) === BigInt(0x20);
        });
    } catch (error) {
        console.error('Error fetching guilds:', error);
    }

    const dashboardData = {
        user: {
            id: user.id,
            username: user.username,
            globalName: user.global_name || user.username,
            avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}${user.avatar.startsWith('a_') ? '.gif' : '.png'}` : '/img/default-avatar.svg',
            discriminator: user.discriminator || '0'
        },
        config: {
            clientId: DISCORD_CLIENT_ID,
            supportServer: config.supportServer,
            botName: config.settings.botName,
            botAvatar: config.settings.botAvatar,
            color: config.settings.color,
            version: config.settings.version,
            footer: config.settings.footer
        },
        stats: botStats,
        guilds: userGuilds.map(g => ({
            id: g.id,
            name: g.name,
            icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
            owner: g.owner,
            permissions: g.permissions,
            canManage: manageableGuilds.some(mg => mg.id === g.id)
        })),
        manageableGuilds: manageableGuilds.map(g => ({
            id: g.id,
            name: g.name,
            icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png` : null,
            owner: g.owner
        })),
        lang: lang
    };

    res.json(dashboardData);
});

// Language switch
app.post('/lang/:lang', (req, res) => {
    const lang = req.params.lang;
    if (['ar', 'en'].includes(lang)) {
        req.session.lang = lang;
    }
    res.redirect('back');
});

// Discord Login
app.get('/auth/discord', (req, res) => {
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds%20guilds.join`;
    res.redirect(discordAuthUrl);
});

// Discord OAuth2 callback
app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect('/');
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', 
            new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: DISCORD_REDIRECT_URI,
                scope: 'identify guilds guilds.join'
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const { access_token, token_type } = tokenResponse.data;

        // Get user info
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        req.session.user = userResponse.data;
        req.session.accessToken = access_token;
        req.session.tokenType = token_type;

        // بعد تسجيل الدخول، نوجه المستخدم إلى لوحة التحكم المتطورة
        res.redirect('/dashboard-pro.html');
    } catch (error) {
        console.error('OAuth2 callback error:', error.response?.data || error.message);
        res.redirect('/');
    }
});

// Logout
app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Add bot to server
app.get('/add-bot/:guildId', (req, res) => {
    const guildId = req.params.guildId;
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`;
    res.redirect(inviteUrl);
});

// API: Get bot info
app.get('/api/bot-info', (req, res) => {
    res.json({
        name: config.settings.botName,
        version: config.settings.version,
        footer: config.settings.footer,
        supportServer: config.supportServer,
        clientId: DISCORD_CLIENT_ID,
        color: config.settings.color
    });
});

// API: Get translations
const fs = require('fs');

app.get('/api/translations', (req, res) => {
    const lang = req.query.lang || 'ar';
    
    // Try external locales first (for standalone website)
    let data;
    const externalPath = path.join(__dirname, '../../locales', `${lang}.json`);
    if (fs.existsSync(externalPath)) {
        data = JSON.parse(fs.readFileSync(externalPath, 'utf8'));
    } else {
        // Use the bot's language files as fallback
        const botLangPath = path.join(__dirname, '..', 'languages', `${lang}.json`);
        if (fs.existsSync(botLangPath)) {
            const botData = JSON.parse(fs.readFileSync(botLangPath, 'utf8'));
            data = {
                lang: lang,
                botName: config.settings.botName,
                botVersion: config.settings.version,
                supportServer: config.supportServer,
                translations: botData.messages || {}
            };
        } else {
            return res.status(404).json({ error: 'Language not found' });
        }
    }
    
    res.json(data);
});

// API: Get current user
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🌐 Website running at http://localhost:${PORT}`);
    console.log(`📝 Discord OAuth2 Redirect URI: ${DISCORD_REDIRECT_URI}`);
});
