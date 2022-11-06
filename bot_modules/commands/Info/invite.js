const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'invite',
	description: 'Invite the bot to your server!',
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Invite the bot to your server!'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Invite Bot')
					.setStyle('LINK')
					.setURL('https://discord.com/oauth2/authorize?client_id=886391809939484722&permissions=8&scope=bot%20applications.commands'),
			)
			.addComponents(
				new MessageButton()
					.setLabel('Support Server')
					.setStyle('LINK')
					.setURL('https://discord.gg/BYVD4AGmYR'),
			);

		const embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('🔗   Invite Link!   🔗')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nClick the button below to invite your bot!\n⠀')
			.setFooter('For any questions/concerns please visit the official TheKWitt server! https://discord.gg/BYVD4AGmYR');

		try{return await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Invite Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Invite Command', 'Reply Denied');}
	},
};