const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'give',
	description: 'Give someone a piece of candy!',
	cooldown: 60,
	reset_cooldown: false,
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give someone a piece of candy!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('id')
				.setDescription('Give candy to someone based on the id of the candy.')
				.addUserOption(option => option.setName('target').setDescription('The user to give candy too').setRequired(true))
				.addIntegerOption(option => option.setName('candy').setDescription('The ID of the Candy to give.').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('name')
				.setDescription('Give candy to someone based on the name of the candy.')
				.addUserOption(option => option.setName('target').setDescription('The user to give candy too').setRequired(true))
				.addStringOption(option => option.setName('candy').setDescription('The Name of the Candy to give.').setRequired(true))),
	async execute(interaction, client) {
		const target = interaction.options.getUser('target');
		try{
			if (target.id == interaction.user.id) return await interaction.reply({ content: 'You cannot give to yourself!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Duplicate Reply'));
		} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
		try{
			if (!target.bot) await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [target.id]);
			else return await interaction.reply(target.username + ' is a bot. It doesn\'t like candy.').then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Bot Warning Reply'));
		}
		catch { client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
		const data_u = await client.pool.query('SELECT candy_bag FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + interaction.user.id + ';');
		const u_bag = data_u.rows[0].candy_bag;
		const data_t = await client.pool.query('SELECT candy_bag FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + target.id + ';');
		const t_bag = data_t.rows[0].candy_bag;
		// No Steal
		if(u_bag.length == 0) {
			// eslint-disable-next-line no-unused-vars
			try{return await interaction.reply({ content: 'You have no candy! Go get some before you try to give any away!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'No Candy Warning Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
		}

		const data = [...new Set(u_bag)].sort();


		if(interaction.options._hoistedOptions[1].type === 'INTEGER') {
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
				try {return await interaction.reply({ content: 'You don\'t have the candy with the id ' + id.toString() + '. Please use /bag to see what candy you have and check the left side of that emoji. Ex -> :id_name: You can also use **/help giving** to get more context', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Wrong Candy ID Warning Reply')); }
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied');}
			}


			u_bag.splice(u_bag.indexOf(candyFind.id), 1);
			t_bag.push(candyFind.id);
			await client.pool.query('UPDATE guild_stats SET given = given + 1 WHERE Guild_ID = $1', [interaction.guild.id]);
			await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2', [u_bag, interaction.user.id]);
			await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2', [t_bag, target.id]);

			const gives = ['**' + interaction.user.username + '** thought **' + target.username + '** was a great friend and decided to treat them with a ' + candyFind.emoji + '!', '**' + interaction.user.username + '** doesn\'t know why but they really wanted to give **' + target.username + '** a ' + candyFind.emoji, '**' + interaction.user.username + '** thinks **' + target.username + '** has the best costume so as a prize they gave them a ' + candyFind.emoji + '!', '**' + interaction.user.username + '** owes **' + target.username + '** five dollars so instead of paying them back, they decide to give them a ' + candyFind.emoji + '!'];

			const embed = new MessageEmbed()
				.setColor(client.colors[0][2])
				.setTitle(interaction.user.username + ' gave ' + target.username + ' candy!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n' + gives[Math.floor(Math.random() * gives.length)] + '\n⠀')
				.setFooter('How thoughtful of them!');

			try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gave ID Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
		}
		else if(interaction.options._hoistedOptions[1].type === 'STRING') {
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
				try{ return await interaction.reply({ content: 'You don\'t have the candy with the name ' + name + '. Please use /bag to see what candy you have and check the right side of that emoji. Ex -> :id_name: You can also use **/help giving** to get more context', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Wrong Candy Name Warning Reply')); }
				catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
			}

			u_bag.splice(u_bag.indexOf(candyFind.id), 1);
			t_bag.push(candyFind.id);

			const gives = ['**' + interaction.user.username + '** thought **' + target.username + '** was a great friend and decided to treat them with a ' + candyFind.emoji + '!', '**' + interaction.user.username + '** doesn\'t know why but they really wanted to give **' + target.username + '** a ' + candyFind.emoji, '**' + interaction.user.username + '** thinks **' + target.username + '** has the best costume so as a prize they gave them a ' + candyFind.emoji + '!', '**' + interaction.user.username + '** owes **' + target.username + '** five dollars so instead of paying them back, they decide to give them a ' + candyFind.emoji + '!'];

			const embed = new MessageEmbed()
				.setColor(client.colors[0][2])
				.setTitle(interaction.user.username + ' gave ' + target.username + ' candy!')
				// eslint-disable-next-line spaced-comment
				//.setThumbnail(user.defaultAvatarURL)
				.setDescription('⠀\n' + gives[Math.floor(Math.random() * gives.length)] + '\n⠀')
				.setFooter('How thoughtful of them!');

			await client.pool.query('UPDATE guild_stats SET given = given + 1 WHERE Guild_ID = $1', [interaction.guild.id]);
			await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2', [u_bag, interaction.user.id]);
			await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2', [t_bag, target.id]);
			try { return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Give Command', 'Gave Name Reply')); }
			catch{ client.extra.log_error_g(client.logger, interaction.guild, 'Give Command', 'Reply Denied'); }
		}

	},
};