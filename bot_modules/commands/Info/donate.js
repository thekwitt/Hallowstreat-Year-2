const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'donate',
	description: 'Visit the donation page!',
	data: new SlashCommandBuilder()
		.setName('donate')
		.setDescription('Visit the donation page!'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel('Donate Link')
					.setStyle('LINK')
					.setURL('https://ko-fi.com/thekwitt'),
			);

		const embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('💵   Ko-Fi Donation Page!   💵')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nAs you may have guessed, running bots on a dedicated server for everyone to enjoy is not cheap. With your help, it is possibly to keep doing this hobby and making greater things along the way!\n\nUse the button below to visit my Ko-Fi Donation Page! (Pssst there are also spoilers on there as well)\n⠀')
			.setFooter('For any questions/concerns please visit the official TheKWitt server! https://discord.gg/BYVD4AGmYR');

		try{return await interaction.reply({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, interaction.guild, 'Donation Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Donation Command', 'Reply Denied');}
	},
};