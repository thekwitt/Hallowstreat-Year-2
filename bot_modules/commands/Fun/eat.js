const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'eat',
	description: 'Eat a piece of candy to gain a cool effect!',
	cooldown: 60,
	reset_cooldown: false,
	data: new SlashCommandBuilder()
		.setName('eat')
		.setDescription('Eat a piece of candy to gain a cool effect!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('id')
				.setDescription('Eat candy based on the id of the candy.')
				.addIntegerOption(option => option.setName('candy').setDescription('The ID of the Candy to eat.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('name')
				.setDescription('Eat candy based on the name of the candy.')
				.addStringOption(option => option.setName('candy').setDescription('The Name of the Candy to eat.').setRequired(true))),
	async execute(interaction, client) {
		const data_u = await client.pool.query('SELECT candy_bag FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + interaction.user.id + ';');
		const u_bag = data_u.rows[0].candy_bag;
		// No Steal
		if(u_bag.length == 0) {
			// eslint-disable-next-line no-unused-vars
			try{return await interaction.reply({ content: 'You have no candy! Go get some before you try to eat any!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Eat Command', 'No Candy Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Eat Command', 'Reply Denied');}
		}

		const data = [...new Set(u_bag)].sort();


		if(interaction.options._hoistedOptions[0].type === 'INTEGER') {
			const id = interaction.options.getInteger('candy');
			const candies = [];
			for(let i = 0; i < data.length; i++)
			{
				candies.push(client.candies.filter(candy => candy.id == data[i])[0]);
			}

			let candyFind = null;
			for(let i = 0; i < candies.length; i++) {
				if (('000' + id).slice(-3) === candies[i].id) {
					candyFind = candies[i];
				}
			}

			if(candyFind == null) {
				this.reset_cooldown = true;
				try {return await interaction.reply({ content: 'You don\'t have the candy with the id ' + id.toString() + '. Please use /bag to see what candy you have and check the left side of that emoji. Ex -> :id_name: You can also use **/help giving** to get more context', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Eat Command', 'Wrong Candy ID Warning Reply')); }
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Eat Command', 'Candy Find Reply Denied');}
			}

			u_bag.splice(u_bag.indexOf(candyFind.id), 1);
			await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2', [u_bag, interaction.user.id]);

			let description = candyFind.description.replace('[name]', interaction.user.username);
			if (description == '') description = ['It tastes like thier favorite flavor!', 'They can\'t get enough of it!', 'They can\'t stop eating it!'][Math.floor(Math.random() * 3)];

			const embed = new MessageEmbed()
				.setColor(client.colors[0][0])
				.setTitle(interaction.user.username + ' ate a piece of ' + candyFind.name + '!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n ' + description + '\n⠀')
				.setFooter('Eat another piece of candy in a minute!');

			try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Eat Command', 'Eat ID Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Eat Command', 'Eat Reply Denied'); }
		}
		else if(interaction.options._hoistedOptions[0].type === 'STRING') {
			const name = interaction.options.getString('candy');
			const candies = [];
			for(let i = 0; i < data.length; i++)
			{
				candies.push(client.candies.filter(candy => candy.id == data[i])[0]);
			}

			let candyFind = null;
			for(let i = 0; i < candies.length; i++) {
				if (name.toLowerCase().replace(/\s/g, '') === candies[i].name.toLowerCase().replace(/\s/g, '')) {
					candyFind = candies[i];
				}
			}

			if(candyFind == null) {
				this.reset_cooldown = true;
				try{ return await interaction.reply({ content: 'You don\'t have the candy with the name ' + name + '. Please use /bag to see what candy you have and check the right side of that emoji. Ex -> :id_name: You can also use **/help giving** to get more context', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Eat Command', 'Wrong Candy Name Warning Reply')); }
				catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Eat Command', 'Reply Denied'); }
			}

			let description = candyFind.description.replace('[name]', interaction.user.username);
			if (description == '') description = ['It tastes like thier favorite flavor!', 'They can\'t get enough of it!', 'They can\'t stop eating it!'][Math.floor(Math.random() * 3)];

			const embed = new MessageEmbed()
				.setColor(client.colors[0][0])
				.setTitle(interaction.user.username + ' ate a piece of ' + candyFind.name + '!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n ' + description + '\n⠀')
				.setFooter('Eat another piece of candy in a minute!');

			try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Eat Command', 'Eat ID Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Eat Command', 'Eat Reply Denied'); }
		}

	},
};