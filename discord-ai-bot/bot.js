require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, Collection } = require('discord.js');
const config = require('./config');
const LanguageManager = require('./utils/language');
const ContentFilter = require('./utils/filter');
const CooldownManager = require('./utils/cooldown');
const EmbedBuilderUtil = require('./utils/embedBuilder');

// Import commands
const adminCommands = require('./commands/admin');
const utilityCommands = require('./commands/utility');
const aiCommands = require('./commands/ai');

class MGBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildPresences
            ]
        });

        this.lang = new LanguageManager();
        this.filter = new ContentFilter();
        this.cooldown = new CooldownManager();
        this.embedBuilder = new EmbedBuilderUtil(this.lang);

        this.commands = new Collection();
        this.commandData = [];

        this.registerCommands();
        this.setupEventHandlers();
    }

    registerCommands() {
        const allCommands = {
            ...adminCommands,
            ...utilityCommands,
            ...aiCommands
        };

        const adminOnlyCommands = ['clear', 'kick', 'ban', 'timeout', 'warn', 'say', 'announce', 'slowmode', 'lock', 'unlock'];

        for (const [name, command] of Object.entries(allCommands)) {
            this.commands.set(name, command);
            this.commandData.push(command.data.toJSON());
        }
    }

    async deployCommands() {
        try {
            const rest = new REST({ version: '10' }).setToken(config.token);
            
            console.log('🔄 Registering slash commands...');
            
            // Register globally
            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: this.commandData }
            );

            // Also register for the specific guild for instant sync
            if (config.guildId) {
                await rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: this.commandData }
                );
            }

            console.log('✅ Slash commands registered successfully!');
        } catch (error) {
            console.error('❌ Failed to register commands:', error);
        }
    }

    setupEventHandlers() {
        this.client.once('ready', async () => {
            console.log(`✅ ${this.client.user.tag} is online!`);
            console.log(`📊 Serving ${this.client.guilds.cache.size} servers`);
            
            // Set bot status
            this.client.user.setPresence({
                activities: [{ 
                    name: `MG AI | /help`, 
                    type: 0 
                }],
                status: 'online'
            });

            // Deploy commands
            await this.deployCommands();
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            try {
                // Check bot permissions
                if (interaction.guild) {
                    const botMember = interaction.guild.members.cache.get(this.client.user.id);
                    if (!botMember.permissions.has('Administrator') && !botMember.permissions.has('ViewChannel')) {
                        return interaction.reply({
                            content: this.lang.get(interaction.user.id, 'messages.no_bot_permission'),
                            ephemeral: true
                        });
                    }
                }

                // Execute command with necessary utilities
                await command.execute(interaction, this.lang, this.filter, this.cooldown);
            } catch (error) {
                console.error(`❌ Error executing command ${interaction.commandName}:`, error);
                
                const errorMsg = this.lang.get(interaction.user.id, 'messages.error');
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({ content: errorMsg }).catch(() => {});
                } else {
                    await interaction.reply({ content: errorMsg, ephemeral: true }).catch(() => {});
                }
            }
        });

        // Handle errors
        this.client.on('error', (error) => {
            console.error('❌ Client error:', error);
        });

        process.on('unhandledRejection', (error) => {
            console.error('❌ Unhandled rejection:', error);
        });
    }

    async start() {
        try {
            await this.client.login(config.token);
        } catch (error) {
            console.error('❌ Failed to login:', error);
            process.exit(1);
        }
    }
}

// Start the bot
const bot = new MGBot();
bot.start();

module.exports = bot;

