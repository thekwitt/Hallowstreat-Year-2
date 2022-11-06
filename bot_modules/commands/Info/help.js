const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// eslint-disable-next-line no-unused-vars
function duplicates(arr, id) {
	let count = 0;
	for(let i = 0; i < arr.length; i++)
	{
		if (arr[i] === id) count++;
	}
	return count;
}

module.exports = {
	name: 'help',
	description: 'Get help for commands and how the bot works!',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help for commands and how the bot works!')
		.addStringOption(option =>
			option.setName('type')
				.setDescription('What kind of help do you need?')
				.setRequired(true)
				.addChoice('Overview of Bot', 'overview')
				.addChoice('List of Commands', 'list')
				.addChoice('Overview of Candy', 'candy')
				.addChoice('Overview of Giving', 'giving')
				.addChoice('Overview of Fun Commands', 'fun')
				.addChoice('Overview of Profile Commands', 'profile')
				.addChoice('Overview of Setting Commands', 'setting')
				.addChoice('Overview of Information Commands', 'info')
				.addChoice('Overview of Moderator Commands', 'mod')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const data = interaction.options.getString('type');
		const raw = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = raw.rows[0];
		let string = '';
		if(setting.channel_set == '0') string = '\n\n**Looks like you haven\'t setup the bot yet! Go ahead and pick a channel by using */setchannel*** to get access to the bot. (You need to have Manage Channel Perms in order to use that command)';

		if(data === 'overview') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Hallows Treat   📙')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n**__What is Hallows Treat?__**\nHallows Treat is a Halloween Bot dedficated to bringing the fun of Halloween to your devices! You can stay more connected with all your friends by collecting candy, giving and stealing candy from your server mates and claiming glory by getting the most candy with a role called **Hallow\'s Champion!**\n\n**__How much candy are we talking?__**\nThere is currently ' + client.candies.filter(candy => candy.emoji != '').length + ' different pieces of candy you can collect!\n\n**__I have a big server. Is there any customization?__**\nDepending on the size of your server you can also use setting commands to change up how the bot responds, allowing more flexibility for anybody\'s server.' + string + '\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', ' Overview Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', 'Overview Reply Denied');}
		} else if(data === 'list') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Command List   📙')
				.addFields(
					{ name: 'Fun Commands', value: '**/give**  **/steal**   **/scavenge**', inline: true },
					{ name: 'Setting Commands', value: '**/setchannel**  **/settings**', inline: true },
					{ name: 'Profile Commands', value: '**/bag**   **/card**   **/leaderboard**', inline: true },
					{ name: 'Info Commands', value: '**/help**   **/donate**   **/support**   **/about**   **/invite**   **/server_stats**', inline: true },
					{ name: 'Moderator Commands', value: '**/addcandy**', inline: true },
				)
				.setDescription('Here is')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'candy') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Candy   📙')
				.setDescription('⠀\n**__What is candy?__**\nCandy is a sweet and color collectable you get from using the bot! There are many different kinds of candy you can collect in this bot!\n\n**__How do you collect candy?__**\nYou can collect candy from pressing buttons on messages that have a bunch of candy on it or using the **/scavenge** command.\n\n**__Is there a prize for getting the most candy?__**\nYes there is! You get a special role called **Hallow\'s Champion!**\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'fun') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Fun Commands   📙')
				.setDescription('⠀\n**__What are fun commands?__**\nFun Commands are commands you can use to collect candy and interaction with other members in your server!\n\n**__What can they do?__**\n\n**/scavenge** - Explore the lands of Hallow\'s Street for candy! Each place has unique interactions and candy for you to collect!\n\n**/steal** - This command allows you to steal from anyone who has candy! You can steal 1-5 pieces of candy every half hour!\n\n**/give** - This command allows you to give a piece of candy to anyone of your choosing. You can give candy by using the name or id of the emoji of that candy when you view it using **/bag**!\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'profile') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Profile Commands   📙')
				.setDescription('⠀\n**__What is profile commands?__**\nProfile Commands are commands you can use to see stats about your time with this bot!\n\n**__What can they do?__**\n\n**/bag** - This commands allows you to view your bag of candy and other people\'s bags of candy!\n\n**/card** - This command displays a card of overall stats of yourself or anyone else on the server.\n\n**/leaderboard** - This commands displays a leaderboard of the top 100 candy collectors on your server! (This excludes people with no candy)\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'setting') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Setting Commands   📙')
				.setDescription('⠀\n**__What is setting commands?__**\nSetting Commands are commands that allow server moderators to customize the bot for the most balanced experience! (You need to have Manage Channel Perms in order to use these commands)\n\n**__What can they do?__**\n\n**/settings** - You can change how frequently the candy message appears by changing the interval of how long it takes and how many messages the chat needs to send.\nYou can also change how many people can get candy from each message and if it can spawn from channels outside the dedicated one! (Ex: #off-topic can spawn messages in #channel-target)\n\n**/setchannel** - Set the channel you want the messages to appear in.\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'mod') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Moderator Commands   📙')
				.setDescription('⠀\n**__What is moderator commands?__**\nModerator Commands are commands that allow server moderators to control the flow of the bot! (You need to have Manage Channel Perms in order to use these commands)\n\n**__What can they do?__**\n\n**/addcandy** - This Command lets you add randomized candy to any user!\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'giving') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Giving   📙')
				.setDescription('⠀\n**__What is giving?__**\nGiving is a way to share your candy with your friends on your server!\n\n**__How can I give candy?__**\n\nYou can give candy using either the id or name on the emoji of that candy!\nThe ID of the candy is on the left, and the name of the candy is on the right! You can use the zeroes for the id or capital and non-capital letters for the name Example -> :**003**_**cobwebsucker**:\n\n**__How do I choose to use the id or name?__**\n\nWhen you type in /give you\'ll get a prompt that asks if you want to choose to use an id or name like /give id or /give name. Depending on what you choose, the command will tell you what to input.\n\n**__Can you use an example?__**\n\nLet\'s say you want to give a buddy <:003_cobwebsucker:893337459188973578>.\nSo you would say **/give id @buddy#0001 003** or **/give id @buddy#0001 3** for ids\nAND\n**/give name @buddy#0001 cobwebsucker** for names.\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		} else if(data === 'info') {
			const embed = new MessageEmbed()
				.setColor(client.colors[0][1])
				.setTitle('📙   Overview of Information Commands   📙')
				.setDescription('⠀\n**__What is information commands?__**\nInformation Commands are commands that show details about the bot and allow people to access credits and more!\n\n**__What can they do?__**\n\n**/help** - Your all in one guide!\n\n**/about** - Shows the people who made this bot happen and special thanks!\n\n**/server_stats** - Shows the statistics of your server!\n\n**/invite** - Want to invite the bot to your server? Use this command!\n\n**/donate** - Help fund the development for more seasonal bots!\n⠀')
				.setFooter('See what else you can learn from the bot!');
			try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Help Command', data));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Help Command', data + ' - Reply Denied');}
		}
	},
};