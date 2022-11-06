const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'server_stats',
	description: 'Get statistics about your server within the bot!',
	data: new SlashCommandBuilder()
		.setName('server_stats')
		.setDescription('Get statistics about your server within the bot!'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const data = await client.pool.query('SELECT * FROM guild_stats WHERE Guild_ID = $1', [interaction.guild.id]);
		const stats = data.rows[0];
		const embed = new MessageEmbed()
			.setColor(client.colors[0][1])
			.setTitle('📖   ' + interaction.guild.name + '\'s Stats   📖')
			.addFields(
				{ name: 'Candy Collected', value: stats.collected + ' pieces of candy', inline: true },
				{ name: 'Candy Stolen', value: stats.candy_stolen + ' pieces of candy', inline: true },
				{ name: 'Candy Given Away', value: stats.given + ' pieces of candy', inline: true },
				{ name: 'Times Explored', value: stats.areas_explored + ' areas explored', inline: true },
			);

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'About Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'About Command', 'Reply Denied');}
	},
};