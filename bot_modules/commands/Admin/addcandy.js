const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	name: 'addcandy',
	description: 'Add random candy to someone\'s inventory!',
	reset_cooldown: false,
	permission: 'MANAGE_CHANNELS',
	data: new SlashCommandBuilder()
		.setName('addcandy')
		.setDescription('Add random candy to someone\'s inventory!')
		.addUserOption(option => option.setName('target').setDescription('The user to add to.').setRequired(true))
		.addIntegerOption(option => option.setName('amount').setDescription('The Amount of Candy').setRequired(true)),
	async execute(interaction, client) {
		const target = interaction.options.getUser('target');
		const amount = interaction.options.getInteger('amount');
		try{
			if (!target.bot) await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [target.id]);
			else return await interaction.reply(target.username + ' is a bot. It doesn\'t like candy.').then(client.extra.log_g(client.logger, interaction.guild, 'Add Command', 'Bot Warning Reply'));
		}
		catch { client.extra.log_error_g(client.logger, interaction.guild, 'Add Command', 'Reply Denied'); }
		const data_t = await client.pool.query('SELECT candy_bag FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + target.id + ';');
		const t_bag = data_t.rows[0].candy_bag;
		// No Steal
		const candies = client.candies.filter(candy => candy.emoji != '');

		try {
			if (amount > 1000) return await interaction.reply('That Number is Higher than 1000, please try again!').then(client.extra.log_g(client.logger, interaction.guild, 'Add Command', 'Higher Number Reply'));
		} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Add Command', 'Reply Denied'); }

		for(let x = 0; x < amount; x++) {
			t_bag.push(candies[Math.floor(Math.random() * candies.length)].id);
		}

		await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2;', [t_bag, target.id]);

		try { return await interaction.reply('Candy Added!').then(client.extra.log_g(client.logger, interaction.guild, 'Add Command', 'Finish Reply'));
		} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Add Command', 'Reply Denied'); }

	},
};