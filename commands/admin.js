const { 
    SlashCommandBuilder, 
    PermissionFlagsBits, 
    EmbedBuilder 
} = require('discord.js');
const ms = require('ms');

module.exports = {
    // Clear command
    clear: {
        data: new SlashCommandBuilder()
            .setName('clear')
            .setNameLocalizations({ 'en-US': 'clear', 'ar-SA': 'مسح' })
            .setDescription('Clear messages in the channel')
            .setDescriptionLocalizations({ 
                'en-US': 'Clear messages in the channel',
                'ar-SA': 'مسح الرسائل في الروم'
            })
            .addIntegerOption(option =>
                option.setName('amount')
                    .setNameLocalizations({ 'en-US': 'amount', 'ar-SA': 'العدد' })
                    .setDescription('Number of messages to clear (1-100)')
                    .setDescriptionLocalizations({
                        'en-US': 'Number of messages to clear (1-100)',
                        'ar-SA': 'عدد الرسائل المراد مسحها (1-100)'
                    })
                    .setRequired(true)
                    .setMinValue(1)
                    .setMaxValue(100))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const amount = interaction.options.getInteger('amount');
            
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                return interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.no_permission'), 
                    ephemeral: true 
                });
            }

            if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
                return interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.no_bot_permission'), 
                    ephemeral: true 
                });
            }

            try {
                const messages = await interaction.channel.bulkDelete(amount, true);
                const reply = await interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.clear_success', { count: messages.size }),
                    ephemeral: true
                });
                
                setTimeout(() => reply.delete().catch(() => {}), 5000);
            } catch (error) {
                console.error(error);
                interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true 
                });
            }
        }
    },

    // Kick command
    kick: {
        data: new SlashCommandBuilder()
            .setName('kick')
            .setNameLocalizations({ 'en-US': 'kick', 'ar-SA': 'طرد' })
            .setDescription('Kick a member from the server')
            .setDescriptionLocalizations({
                'en-US': 'Kick a member from the server',
                'ar-SA': 'طرد عضو من السيرفر'
            })
            .addUserOption(option =>
                option.setName('user')
                    .setNameLocalizations({ 'en-US': 'user', 'ar-SA': 'العضو' })
                    .setDescription('The user to kick')
                    .setDescriptionLocalizations({
                        'en-US': 'The user to kick',
                        'ar-SA': 'العضو المراد طرده'
                    })
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setNameLocalizations({ 'en-US': 'reason', 'ar-SA': 'السبب' })
                    .setDescription('Reason for the kick')
                    .setDescriptionLocalizations({
                        'en-US': 'Reason for the kick',
                        'ar-SA': 'سبب الطرد'
                    })
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.guild.members.cache.get(user.id);

            if (!member) {
                return interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.user_not_found'), 
                    ephemeral: true 
                });
            }

            if (!member.kickable) {
                return interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.no_bot_permission'),
                    ephemeral: true 
                });
            }

            try {
                await member.kick(reason);
                interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.kick_success', { user: user.tag })
                });
            } catch (error) {
                console.error(error);
                interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true 
                });
            }
        }
    },

    // Ban command
    ban: {
        data: new SlashCommandBuilder()
            .setName('ban')
            .setNameLocalizations({ 'en-US': 'ban', 'ar-SA': 'حظر' })
            .setDescription('Ban a member from the server')
            .setDescriptionLocalizations({
                'en-US': 'Ban a member from the server',
                'ar-SA': 'حظر عضو من السيرفر'
            })
            .addUserOption(option =>
                option.setName('user')
                    .setNameLocalizations({ 'en-US': 'user', 'ar-SA': 'العضو' })
                    .setDescription('The user to ban')
                    .setDescriptionLocalizations({
                        'en-US': 'The user to ban',
                        'ar-SA': 'العضو المراد حظره'
                    })
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setNameLocalizations({ 'en-US': 'reason', 'ar-SA': 'السبب' })
                    .setDescription('Reason for the ban')
                    .setDescriptionLocalizations({
                        'en-US': 'Reason for the ban',
                        'ar-SA': 'سبب الحظر'
                    })
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.guild.members.cache.get(user.id);

            if (!member) {
                return interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.user_not_found'), 
                    ephemeral: true 
                });
            }

            if (!member.bannable) {
                return interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.no_bot_permission'),
                    ephemeral: true 
                });
            }

            try {
                await member.ban({ reason });
                interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.ban_success', { user: user.tag })
                });
            } catch (error) {
                console.error(error);
                interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true 
                });
            }
        }
    },

    // Timeout command
    timeout: {
        data: new SlashCommandBuilder()
            .setName('timeout')
            .setNameLocalizations({ 'en-US': 'timeout', 'ar-SA': 'كتم' })
            .setDescription('Timeout a member temporarily')
            .setDescriptionLocalizations({
                'en-US': 'Timeout a member temporarily',
                'ar-SA': 'كتم عضو مؤقتاً'
            })
            .addUserOption(option =>
                option.setName('user')
                    .setNameLocalizations({ 'en-US': 'user', 'ar-SA': 'العضو' })
                    .setDescription('The user to timeout')
                    .setDescriptionLocalizations({
                        'en-US': 'The user to timeout',
                        'ar-SA': 'العضو المراد كتمه'
                    })
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('duration')
                    .setNameLocalizations({ 'en-US': 'duration', 'ar-SA': 'المدة' })
                    .setDescription('Duration (e.g. 1m, 1h, 1d)')
                    .setDescriptionLocalizations({
                        'en-US': 'Duration (e.g. 1m, 1h, 1d)',
                        'ar-SA': 'المدة (مثال: 1m, 1h, 1d)'
                    })
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setNameLocalizations({ 'en-US': 'reason', 'ar-SA': 'السبب' })
                    .setDescription('Reason for the timeout')
                    .setDescriptionLocalizations({
                        'en-US': 'Reason for the timeout',
                        'ar-SA': 'سبب الكتم'
                    })
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const user = interaction.options.getUser('user');
            const duration = interaction.options.getString('duration');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.guild.members.cache.get(user.id);

            if (!member) {
                return interaction.reply({ 
                    content: lang.get(interaction.user.id, 'messages.user_not_found'), 
                    ephemeral: true 
                });
            }

            const timeoutDuration = ms(duration);
            if (!timeoutDuration) {
                return interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.invalid_time'),
                    ephemeral: true
                });
            }

            if (!member.moderatable) {
                return interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.no_bot_permission'),
                    ephemeral: true
                });
            }

            try {
                await member.timeout(timeoutDuration, reason);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.timeout_success', { 
                        user: user.tag, 
                        duration: duration 
                    })
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true
                });
            }
        }
    },

    // Warn command
    warn: {
        data: new SlashCommandBuilder()
            .setName('warn')
            .setNameLocalizations({ 'en-US': 'warn', 'ar-SA': 'تحذير' })
            .setDescription('Warn a member')
            .setDescriptionLocalizations({
                'en-US': 'Warn a member',
                'ar-SA': 'إرسال تحذير لعضو'
            })
            .addUserOption(option =>
                option.setName('user')
                    .setNameLocalizations({ 'en-US': 'user', 'ar-SA': 'العضو' })
                    .setDescription('The user to warn')
                    .setDescriptionLocalizations({
                        'en-US': 'The user to warn',
                        'ar-SA': 'العضو المراد تحذيره'
                    })
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('reason')
                    .setNameLocalizations({ 'en-US': 'reason', 'ar-SA': 'السبب' })
                    .setDescription('Reason for the warning')
                    .setDescriptionLocalizations({
                        'en-US': 'Reason for the warning',
                        'ar-SA': 'سبب التحذير'
                    })
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const member = interaction.guild.members.cache.get(user.id);

            if (!member) {
                return interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.user_not_found'),
                    ephemeral: true
                });
            }

            try {
                await user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#FFA500')
                            .setTitle('⚠️ Warning')
                            .setDescription(`You have been warned in **${interaction.guild.name}**`)
                            .addFields(
                                { name: 'Reason', value: reason },
                                { name: 'Moderator', value: interaction.user.tag }
                            )
                            .setTimestamp()
                    ]
                }).catch(() => {}); // If DMs are closed

                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.warn_success', { user: user.tag })
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true
                });
            }
        }
    },

    // Say command
    say: {
        data: new SlashCommandBuilder()
            .setName('say')
            .setNameLocalizations({ 'en-US': 'say', 'ar-SA': 'قل' })
            .setDescription('Make the bot say something')
            .setDescriptionLocalizations({
                'en-US': 'Make the bot say something',
                'ar-SA': 'جعل البوت يقول شيئاً'
            })
            .addStringOption(option =>
                option.setName('message')
                    .setNameLocalizations({ 'en-US': 'message', 'ar-SA': 'الرسالة' })
                    .setDescription('Message to send')
                    .setDescriptionLocalizations({
                        'en-US': 'Message to send',
                        'ar-SA': 'الرسالة المراد إرسالها'
                    })
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const message = interaction.options.getString('message');
            
            await interaction.channel.send(message);
            interaction.reply({
                content: lang.get(interaction.user.id, 'messages.say_success'),
                ephemeral: true
            });
        }
    },

    // Announce command
    announce: {
        data: new SlashCommandBuilder()
            .setName('announce')
            .setNameLocalizations({ 'en-US': 'announce', 'ar-SA': 'اعلان' })
            .setDescription('Send an announcement to the server')
            .setDescriptionLocalizations({
                'en-US': 'Send an announcement to the server',
                'ar-SA': 'إرسال إعلان في السيرفر'
            })
            .addStringOption(option =>
                option.setName('title')
                    .setNameLocalizations({ 'en-US': 'title', 'ar-SA': 'العنوان' })
                    .setDescription('Announcement title')
                    .setDescriptionLocalizations({
                        'en-US': 'Announcement title',
                        'ar-SA': 'عنوان الإعلان'
                    })
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('message')
                    .setNameLocalizations({ 'en-US': 'message', 'ar-SA': 'الرسالة' })
                    .setDescription('Announcement message')
                    .setDescriptionLocalizations({
                        'en-US': 'Announcement message',
                        'ar-SA': 'نص الإعلان'
                    })
                    .setRequired(true))
            .addChannelOption(option =>
                option.setName('channel')
                    .setNameLocalizations({ 'en-US': 'channel', 'ar-SA': 'الروم' })
                    .setDescription('Channel to send announcement to')
                    .setDescriptionLocalizations({
                        'en-US': 'Channel to send announcement to',
                        'ar-SA': 'الروم المرسل إليه الإعلان'
                    })
                    .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const title = interaction.options.getString('title');
            const message = interaction.options.getString('message');
            const channel = interaction.options.getChannel('channel') || interaction.channel;

            const embed = new EmbedBuilder()
                .setColor('#444444')
                .setTitle(`📢 ${title}`)
                .setDescription(message)
                .setFooter({ text: 'MG CoDe' })
                .setTimestamp();

            try {
                await channel.send({ embeds: [embed] });
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.announce_success'),
                    ephemeral: true
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true
                });
            }
        }
    },

    // Slowmode command
    slowmode: {
        data: new SlashCommandBuilder()
            .setName('slowmode')
            .setNameLocalizations({ 'en-US': 'slowmode', 'ar-SA': 'وضع-بطيء' })
            .setDescription('Set slowmode in the channel')
            .setDescriptionLocalizations({
                'en-US': 'Set slowmode in the channel',
                'ar-SA': 'تعديل الوضع البطيء للروم'
            })
            .addIntegerOption(option =>
                option.setName('seconds')
                    .setNameLocalizations({ 'en-US': 'seconds', 'ar-SA': 'الثواني' })
                    .setDescription('Slow mode in seconds (0 to disable)')
                    .setDescriptionLocalizations({
                        'en-US': 'Slow mode in seconds (0 to disable)',
                        'ar-SA': 'الوضع البطيء بالثواني (0 للإلغاء)'
                    })
                    .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
            .setDMPermission(false),

        async execute(interaction, lang) {
            const seconds = interaction.options.getInteger('seconds');

            try {
                await interaction.channel.setRateLimitPerUser(seconds);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.slowmode_success', { seconds }),
                    ephemeral: seconds > 0
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true
                });
            }
        }
    },

    // Lock command
    lock: {
        data: new SlashCommandBuilder()
            .setName('lock')
            .setNameLocalizations({ 'en-US': 'lock', 'ar-SA': 'قفل' })
            .setDescription('Lock the channel')
            .setDescriptionLocalizations({
                'en-US': 'Lock the channel',
                'ar-SA': 'قفل الروم'
            })
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
            .setDMPermission(false),

        async execute(interaction, lang) {
            try {
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: false
                });
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.lock_success')
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true
                });
            }
        }
    },

    // Unlock command
    unlock: {
        data: new SlashCommandBuilder()
            .setName('unlock')
            .setNameLocalizations({ 'en-US': 'unlock', 'ar-SA': 'فتح' })
            .setDescription('Unlock the channel')
            .setDescriptionLocalizations({
                'en-US': 'Unlock the channel',
                'ar-SA': 'فتح الروم'
            })
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
            .setDMPermission(false),

        async execute(interaction, lang) {
            try {
                await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: null
                });
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.unlock_success')
                });
            } catch (error) {
                console.error(error);
                interaction.reply({
                    content: lang.get(interaction.user.id, 'messages.error'),
                    ephemeral: true
                });
            }
        }
    }
};

