const { 
    SlashCommandBuilder, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle 
} = require('discord.js');
const config = require('../config');

module.exports = {
    // Help command
    help: {
        data: new SlashCommandBuilder()
            .setName('help')
            .setNameLocalizations({ 'en-US': 'help', 'ar-SA': 'مساعدة' })
            .setDescription('Show list of available commands')
            .setDescriptionLocalizations({
                'en-US': 'Show list of available commands',
                'ar-SA': 'عرض قائمة الأوامر المتاحة'
            }),

        async execute(interaction, lang) {
            const commands = {
                ai: [
                    `\`/${lang.getCommandName(interaction.user.id, 'ask')}\` - ${lang.getCommandDescription(interaction.user.id, 'ask')}`
                ],
                admin: [
                    `\`/${lang.getCommandName(interaction.user.id, 'clear')}\` - ${lang.getCommandDescription(interaction.user.id, 'clear')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'kick')}\` - ${lang.getCommandDescription(interaction.user.id, 'kick')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'ban')}\` - ${lang.getCommandDescription(interaction.user.id, 'ban')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'timeout')}\` - ${lang.getCommandDescription(interaction.user.id, 'timeout')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'warn')}\` - ${lang.getCommandDescription(interaction.user.id, 'warn')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'say')}\` - ${lang.getCommandDescription(interaction.user.id, 'say')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'announce')}\` - ${lang.getCommandDescription(interaction.user.id, 'announce')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'slowmode')}\` - ${lang.getCommandDescription(interaction.user.id, 'slowmode')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'lock')}\` - ${lang.getCommandDescription(interaction.user.id, 'lock')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'unlock')}\` - ${lang.getCommandDescription(interaction.user.id, 'unlock')}`
                ],
                utility: [
                    `\`/${lang.getCommandName(interaction.user.id, 'help')}\` - ${lang.getCommandDescription(interaction.user.id, 'help')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'ping')}\` - ${lang.getCommandDescription(interaction.user.id, 'ping')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'userinfo')}\` - ${lang.getCommandDescription(interaction.user.id, 'userinfo')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'serverinfo')}\` - ${lang.getCommandDescription(interaction.user.id, 'serverinfo')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'botinfo')}\` - ${lang.getCommandDescription(interaction.user.id, 'botinfo')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'invite')}\` - ${lang.getCommandDescription(interaction.user.id, 'invite')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'language')}\` - ${lang.getCommandDescription(interaction.user.id, 'language')}`,
                    `\`/${lang.getCommandName(interaction.user.id, 'report')}\` - ${lang.getCommandDescription(interaction.user.id, 'report')}`
                ]
            };

            const embed = new EmbedBuilder()
                .setColor(config.settings.color)
                .setTitle(lang.get(interaction.user.id, 'messages.help_title'))
                .setDescription(`${lang.get(interaction.user.id, 'messages.welcome_desc')}\n\n${lang.get(interaction.user.id, 'messages.botinfo_desc')}`)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .addFields(
                    {
                        name: lang.get(interaction.user.id, 'messages.help_ai'),
                        value: commands.ai.join('\n'),
                        inline: false
                    },
                    {
                        name: lang.get(interaction.user.id, 'messages.help_admin'),
                        value: commands.admin.join('\n'),
                        inline: false
                    },
                    {
                        name: lang.get(interaction.user.id, 'messages.help_utility'),
                        value: commands.utility.join('\n'),
                        inline: false
                    }
                )
                .setFooter({ 
                    text: lang.get(interaction.user.id, 'messages.help_footer'),
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(lang.get(interaction.user.id, 'messages.support'))
                        .setStyle(ButtonStyle.Link)
                        .setURL(config.supportServer),
                    new ButtonBuilder()
                        .setLabel(lang.get(interaction.user.id, 'messages.invite'))
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`),
                    new ButtonBuilder()
                        .setLabel(lang.get(interaction.user.id, 'messages.website'))
                        .setStyle(ButtonStyle.Link)
                        .setURL(`http://localhost:${config.port}`) // Change this in production
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        }
    },

    // Ping command
    ping: {
        data: new SlashCommandBuilder()
            .setName('ping')
            .setNameLocalizations({ 'en-US': 'ping', 'ar-SA': 'بينج' })
            .setDescription('Show bot latency')
            .setDescriptionLocalizations({
                'en-US': 'Show bot latency',
                'ar-SA': 'عرض سرعة الاتصال'
            }),

        async execute(interaction, lang) {
            const sent = await interaction.reply({ 
                content: lang.get(interaction.user.id, 'messages.ping_desc', { 
                    ping: '...', 
                    api: '...' 
                }), 
                fetchReply: true 
            });

            interaction.editReply({
                content: lang.get(interaction.user.id, 'messages.ping_desc', { 
                    ping: sent.createdTimestamp - interaction.createdTimestamp, 
                    api: interaction.client.ws.ping 
                })
            });
        }
    },

    // User Info command
    userinfo: {
        data: new SlashCommandBuilder()
            .setName('userinfo')
            .setNameLocalizations({ 'en-US': 'userinfo', 'ar-SA': 'معلومات-عضو' })
            .setDescription('Show information about a user')
            .setDescriptionLocalizations({
                'en-US': 'Show information about a user',
                'ar-SA': 'عرض معلومات عن عضو'
            })
            .addUserOption(option =>
                option.setName('user')
                    .setNameLocalizations({ 'en-US': 'user', 'ar-SA': 'العضو' })
                    .setDescription('The user to get info about')
                    .setDescriptionLocalizations({
                        'en-US': 'The user to get info about',
                        'ar-SA': 'العضو المراد عرض معلوماته'
                    })
                    .setRequired(false)),

        async execute(interaction, lang) {
            const user = interaction.options.getUser('user') || interaction.user;
            const member = interaction.guild.members.cache.get(user.id);

            const embed = new EmbedBuilder()
                .setColor(config.settings.color)
                .setTitle(lang.get(interaction.user.id, 'messages.userinfo_title'))
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .addFields(
                    { name: '👤', value: user.tag, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.userinfo_id'), value: user.id, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.userinfo_created'), value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.userinfo_joined'), value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
                    { name: lang.get(interaction.user.id, 'messages.userinfo_roles'), value: member ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).join(', ') || 'None' : 'N/A', inline: false }
                )
                .setFooter({ text: config.settings.footer })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    // Server Info command
    serverinfo: {
        data: new SlashCommandBuilder()
            .setName('serverinfo')
            .setNameLocalizations({ 'en-US': 'serverinfo', 'ar-SA': 'معلومات-سيرفر' })
            .setDescription('Show server information')
            .setDescriptionLocalizations({
                'en-US': 'Show server information',
                'ar-SA': 'عرض معلومات السيرفر'
            }),

        async execute(interaction, lang) {
            const guild = interaction.guild;
            const owner = await guild.fetchOwner();

            const embed = new EmbedBuilder()
                .setColor(config.settings.color)
                .setTitle(lang.get(interaction.user.id, 'messages.serverinfo_title'))
                .setThumbnail(guild.iconURL({ dynamic: true, size: 2048 }))
                .addFields(
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_name'), value: guild.name, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_id'), value: guild.id, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_owner'), value: owner.user.tag, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_members'), value: `${guild.memberCount}`, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_channels'), value: `${guild.channels.cache.size}`, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_roles'), value: `${guild.roles.cache.size}`, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_boost'), value: `${guild.premiumSubscriptionCount || 0} (${guild.premiumTier || 0})`, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.serverinfo_created'), value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
                )
                .setFooter({ text: config.settings.footer })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    // Bot Info command
    botinfo: {
        data: new SlashCommandBuilder()
            .setName('botinfo')
            .setNameLocalizations({ 'en-US': 'botinfo', 'ar-SA': 'معلومات-بوت' })
            .setDescription('Show bot information')
            .setDescriptionLocalizations({
                'en-US': 'Show bot information',
                'ar-SA': 'عرض معلومات البوت'
            }),

        async execute(interaction, lang) {
            const client = interaction.client;
            const uptime = Math.floor(client.uptime / 1000);
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);

            const embed = new EmbedBuilder()
                .setColor(config.settings.color)
                .setTitle(lang.get(interaction.user.id, 'messages.botinfo_title'))
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(lang.get(interaction.user.id, 'messages.botinfo_desc'))
                .addFields(
                    { name: '📛', value: client.user.tag, inline: true },
                    { name: '🆔', value: client.user.id, inline: true },
                    { name: '📊 Servers', value: `${client.guilds.cache.size}`, inline: true },
                    { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
                    { name: '⏰ Uptime', value: `${days}d ${hours}h ${minutes}m`, inline: true },
                    { name: '📚 Version', value: config.settings.version, inline: true },
                    { name: '⚙️ Language', value: lang.get(interaction.user.id, 'language_name'), inline: true }
                )
                .setFooter({ text: config.settings.footer })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },

    // Invite command
    invite: {
        data: new SlashCommandBuilder()
            .setName('invite')
            .setNameLocalizations({ 'en-US': 'invite', 'ar-SA': 'دعوة' })
            .setDescription('Get bot invite link')
            .setDescriptionLocalizations({
                'en-US': 'Get bot invite link',
                'ar-SA': 'رابط دعوة البوت'
            }),

        async execute(interaction, lang) {
            const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`;
            
            const embed = new EmbedBuilder()
                .setColor(config.settings.color)
                .setTitle('📨 Invite MG AI')
                .setDescription(`[${lang.get(interaction.user.id, 'messages.invite')}](${inviteUrl})\n[${lang.get(interaction.user.id, 'messages.support')}](${config.supportServer})`)
                .setFooter({ text: config.settings.footer })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(lang.get(interaction.user.id, 'messages.invite'))
                        .setStyle(ButtonStyle.Link)
                        .setURL(inviteUrl),
                    new ButtonBuilder()
                        .setLabel(lang.get(interaction.user.id, 'messages.support'))
                        .setStyle(ButtonStyle.Link)
                        .setURL(config.supportServer)
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        }
    },

    // Language command
    language: {
        data: new SlashCommandBuilder()
            .setName('language')
            .setNameLocalizations({ 'en-US': 'language', 'ar-SA': 'لغة' })
            .setDescription('Change bot language')
            .setDescriptionLocalizations({
                'en-US': 'Change bot language',
                'ar-SA': 'تغيير لغة البوت'
            })
            .addStringOption(option =>
                option.setName('lang')
                    .setNameLocalizations({ 'en-US': 'language', 'ar-SA': 'اللغة' })
                    .setDescription('Choose language')
                    .setDescriptionLocalizations({
                        'en-US': 'Choose language',
                        'ar-SA': 'اختر اللغة'
                    })
                    .addChoices(
                        { name: '🇸🇦 العربية', value: 'ar' },
                        { name: '🇬🇧 English', value: 'en' }
                    )
                    .setRequired(true)),

        async execute(interaction, lang) {
            const selectedLang = interaction.options.getString('lang');
            
            if (lang.setUserLanguage(interaction.user.id, selectedLang)) {
                // After setting the language, the get() will use the new language
                await interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.language_changed') 
                });
            } else {
                await interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true 
                });
            }
        }
    },

    // Report command
    report: {
        data: new SlashCommandBuilder()
            .setName('report')
            .setNameLocalizations({ 'en-US': 'report', 'ar-SA': 'ابلاغ' })
            .setDescription('Report a user')
            .setDescriptionLocalizations({
                'en-US': 'Report a user',
                'ar-SA': 'الإبلاغ عن مستخدم'
            })
            .addUserOption(option =>
                option.setName('user')
                    .setNameLocalizations({ 'en-US': 'user', 'ar-SA': 'العضو' })
                    .setDescription('User to report')
                    .setDescriptionLocalizations({
                        'en-US': 'User to report',
                        'ar-SA': 'العضو المراد الإبلاغ عنه'
                    })
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setNameLocalizations({ 'en-US': 'reason', 'ar-SA': 'السبب' })
                    .setDescription('Reason for the report')
                    .setDescriptionLocalizations({
                        'en-US': 'Reason for the report',
                        'ar-SA': 'سبب الإبلاغ'
                    })
                    .setRequired(true)),

        async execute(interaction, lang) {
            const reportedUser = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');

            // Send to owner
            const owner = await interaction.client.users.fetch(config.ownerId);
            const reportEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle(lang.get(interaction.user.id, 'messages.report_title'))
                .addFields(
                    { name: lang.get(interaction.user.id, 'messages.report_from'), value: interaction.user.tag, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.report_user'), value: reportedUser.tag, inline: true },
                    { name: lang.get(interaction.user.id, 'messages.report_reason'), value: reason, inline: false },
                    { name: lang.get(interaction.user.id, 'messages.report_channel'), value: interaction.channel.toString(), inline: false }
                )
                .setFooter({ text: config.settings.footer })
                .setTimestamp();

            try {
                await owner.send({ embeds: [reportEmbed] });
                await interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.report_success'),
                    ephemeral: true 
                });
            } catch (error) {
                console.error(error);
                await interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true 
                });
            }
        }
    }
};

