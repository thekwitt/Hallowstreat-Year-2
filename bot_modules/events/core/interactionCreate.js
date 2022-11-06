// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Collection, MessageEmbed } = require('discord.js');
const cooldowns = new Map();

module.exports = {
	name: 'interactionCreate',

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		if(client.ready == true) {
			if (interaction.componentType === 'BUTTON' && (interaction.customId === 'Treat' || interaction.customId === 'Trick')) {
				try{ await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [interaction.user.id]); }
				// eslint-disable-next-line max-statements-per-line
				catch { await interaction.deferReply(); client.extra.addGuildStuff(interaction.guild, client); client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create', 'Insert Member Denied'); await client.extra.sleep(3000); client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Retry Operation'); await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [interaction.user.id]); }
			} else if(interaction.inGuild() && interaction.guild != undefined) {
				if (!interaction.isCommand()) return;

				const { commandName } = interaction;

				if (!client.commands.has(commandName)) return;

				if (!interaction.guild) return;

				try{ await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [interaction.user.id]); }
				// eslint-disable-next-line max-statements-per-line
				catch { await interaction.deferReply(); client.extra.addGuildStuff(interaction.guild, client); client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create', 'Insert Member Denied'); await client.extra.sleep(3000); client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Retry Operation'); await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [interaction.user.id]); }
				await client.extra.organize_roles(client, interaction.channel, interaction.guild);

				const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
				const setting = data.rows[0];

				// Check Channel ID
				const list = interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');

				if(!list.has(setting.channel_set) && setting.channel_set != 0) {

					await client.pool.query('UPDATE guild_settings SET channel_set = 0 WHERE Guild_ID = $1', [interaction.guild.id]);
				}

				const command = client.commands.get(interaction.commandName);

				if(!cooldowns.has(commandName)) {
					cooldowns.set(commandName, new Collection());
				}

				const current_time = Date.now();
				const time_stamps = cooldowns.get(commandName);
				const cooldown_amount = (command.cooldown) * 1000;

				// Check Member ID + Guild ID
				if(time_stamps.has(interaction.member.id + '' + interaction.guild.id)) {
					const expire_time = time_stamps.get(interaction.member.id + '' + interaction.guild.id) + cooldown_amount;

					if(current_time < expire_time) {
						// eslint-disable-next-line no-unused-vars
						const time_left = expire_time - current_time;
						const time = new Date(time_left);
						try{return await interaction.reply({ content: 'Looks like you\'ve used this command lately! Please wait ' + time.getMinutes() + ' minutes ' + time.getSeconds() + ' seconds!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Cooldown Reply'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
					}
				}

				time_stamps.set(interaction.member.id + '' + interaction.guild.id, current_time);
				cooldowns.set(commandName, time_stamps);
				setTimeout(() => time_stamps.delete(interaction.member.id + '' + interaction.guildId), cooldown_amount);


				try {
					// eslint-disable-next-line prefer-const

					if(setting.channel_set == 0 && (commandName != 'setchannel' && commandName != 'help')) {
						try{return await interaction.reply({ content: 'Looks like you don\'t have a channel set or your old channel is gone. Please have an admin set a new one!' }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'No Channel Reply'));}
						catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
					}
					else if(((commandName === 'setchannel' || commandName === 'help') && setting.channel_set == 0) || (setting.channel_set != 0)) {
						if(command.permission) {
							const authorPerms = interaction.channel.permissionsFor(interaction.member);
							if(!authorPerms || !authorPerms.has(command.permission)) {
								const bucketEmbed = new MessageEmbed()
									.setColor('RED')
									.setTitle('You don\'t have permission to use this command.')
									.setDescription('You need the ability to ' + command.permission + ' to use this!')
									.setFooter('If you encounter anymore problems, please join https://discord.gg/BYVD4AGmYR and tag TheKWitt!');
								try{await interaction.reply({ embeds: [bucketEmbed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Invalid Perms Reply'));}
								catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}

							// eslint-disable-next-line max-statements-per-line
							} else { await command.execute(interaction, client); }
						// eslint-disable-next-line max-statements-per-line
						} else { await command.execute(interaction, client); }
					}

					if (command.reset_cooldown) time_stamps.delete(interaction.member.id + '' + interaction.guild.id);

				} catch (error) {
					console.error(error);
					try{await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Interaction Create Event', 'Error Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Interaction Create Event', 'Reply Denied');}
				}
			}
		}
	},
};