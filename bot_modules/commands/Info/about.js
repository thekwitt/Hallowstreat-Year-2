const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars

module.exports = {
	name: 'about',
	description: 'About The Creators of the Bot!',
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('About The Creators of the Bot!'),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const guild = client.guilds.cache.find(g => g.id == '746399419460616193');
		const members = await guild.members.cache;
		const filtered = members.filter(u => u.roles.cache.has('779520789812609025'));
		const temp = filtered.random(5);
		const names = [];
		for(let i = 0; i < 5; i++) {
			names.push(temp[i].user.username);
		}
		const embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('📖   About Hallow\'s Treat   📖')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\n__**Developer and Artist**__\nTheKWitt\n\n__**Artistic Direction**__\nRocky and Bunny\n\n__**Backend Help**__\nC̵̼̍ͅo̶̢̞͒̈n̵̺͗͑̎͜k̶̩̳͎̉̌̎ĕ̵͍͝r̷̡͒̈́͑\n⠀')
			.setFooter(names.join(', ') + ' and ' + (filtered.size - 5) + ' other beta testers made this happen!');

		try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'About Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'About Command', 'Reply Denied');}
	},
};