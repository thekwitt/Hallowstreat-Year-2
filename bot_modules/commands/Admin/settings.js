const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'settings',
	description: 'Get or Set Settings for the bot on your server!',
	reset_cooldown: false,
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Get or Set Settings for the bot on your server!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('get_settings')
				.setDescription('Get a list of all your settings.'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('enable_stealing')
				.setDescription('Enable stealing on your server.')
				.addBooleanOption(option => option.setName('steal').setDescription('Yes or No').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_trigger_outside_channel')
				.setDescription('Set if you want messages to be triggered outside the candy channel.')
				.addBooleanOption(option => option.setName('outside').setDescription('Yes or No').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_message_count_amount')
				.setDescription('Set how many messages for the candy message to appear.')
				.addIntegerOption(option => option.setName('count').setDescription('The Number of Messages').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_message_count_interval')
				.setDescription('Set how long it takes for the candy message to appear.')
				.addIntegerOption(option => option.setName('interval').setDescription('The amount of seconds').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('set_people_per_message')
				.setDescription('Set how many people can get candy from a message.')
				.addIntegerOption(option => option.setName('amount').setDescription('The amount of people').setRequired(true))),
	permission: 'MANAGE_CHANNELS',
	async execute(interaction, client) {
		const outside = interaction.options.getBoolean('outside');
		const count = interaction.options.getInteger('count');
		const interval = interaction.options.getInteger('interval');
		const amount = interaction.options.getInteger('amount');
		const steal = interaction.options.getBoolean('steal');

		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];

		if(outside != undefined) {
			await client.pool.query('UPDATE guild_settings SET trigger_outside = $1 WHERE Guild_ID = $2', [outside, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Candy Messages being able to be triggered outside the set channel is now ' + outside.toString()).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 1 Command', 'Confirm Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
		} else if (count != undefined) {
			try {
				if (count < 1) return await interaction.reply('That Number is lower than 1, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 2 Command', 'Lower Number Reply'));
				else if (count > 1000) return await interaction.reply('That Number is higher than 1000, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 2 Command', 'High Number Reply'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 2 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET message_count = $1 WHERE Guild_ID = $2', [count, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Candy Messages will appear after ' + count.toString() + ' messages.').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 2 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 2 Command', 'Reply Denied')); }
		} else if (interval != undefined) {
			try {
				if (interval < 60) return await interaction.reply('That Number is lower than 60, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 3 Command', 'Lower Number Reply'));
				else if (interval > 3600) return await interaction.reply('That Number is higher than 36000, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 3 Command', 'High Number Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 3 Command', 'Reply Denied'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 2 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET message_interval = $1 WHERE Guild_ID = $2', [interval, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply('Candy Messages will appear after ' + interval.toString() + ' seconds.').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 3 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 3 Command', 'Reply Denied')); }
		} else if (amount != undefined) {
			try {
				if (amount < 1) return await interaction.reply('That Number is lower than 1, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Lower Number Reply'));
				else if (amount > 100) return await interaction.reply('That Number is higher than 100, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'High Number Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied'); }
			await client.pool.query('UPDATE guild_settings SET obtain_amount = $1 WHERE Guild_ID = $2', [amount, interaction.guild.id]);
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(interaction.guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
			try { return await interaction.reply(amount.toString() + ' people can get candy from one candy message at a time!').then(client.extra.log_g(client.logger, interaction.guild, 'Settings 4 Command', 'Confirm Reply')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 4 Command', 'Reply Denied')); }
		} else if(steal != undefined) {
			await client.pool.query('UPDATE guild_settings SET enable_steal = $1 WHERE Guild_ID = $2', [steal, interaction.guild.id]);
			try { return await interaction.reply('Members being able to steal is now set to ' + steal.toString()).then(client.extra.log_g(client.logger, interaction.guild, 'Settings 5 Command', 'Confirm Reply')).catch(client.extra.log_error_g(client.logger, interaction.guild, 'Settings 1 Command', 'Reply Denied')); }
			catch { (client.extra.log_error_g(client.logger, interaction.guild, 'Settings 5 Command', 'Reply Denied')); }
		} else {
			const channel = interaction.guild.channels.cache.get(setting.channel_set.toString());
			const embed = new MessageEmbed()
				.setColor(client.colors[0][0])
				.setTitle(interaction.guild.name + '\'s Settings')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\nCandy Channel: ' + channel.name + '\n\nMessages being able to be triggered outside the set channel: ' + setting.trigger_outside + '\n\nMessages to Trigger Candy Messages: ' + setting.message_count + ' Messages\n\nSeconds till a Candy Message Spawns: ' + setting.message_interval + ' Seconds.\n\nAmount of People that can collect from a candy message: ' + setting.obtain_amount + ' People.\n\nPeople being able to steal on the server: ' + setting.enable_steal + '.\n⠀');
			try{ return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Get Settings Command', 'Confirm Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Get Settings Command', 'Reply Denied'); }
		}

	},
};