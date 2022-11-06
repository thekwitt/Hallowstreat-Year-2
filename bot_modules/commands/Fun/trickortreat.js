const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
	name: 'scavenge',
	description: 'Scavenge in an area in Hallow City for more candy!',
	cooldown: 600,
	reset_cooldown: false,
	data: new SlashCommandBuilder()
		.setName('scavenge')
		.setDescription('Scavenge in an area in Hallow City for more candy!')
		.addStringOption(option =>
			option.setName('area')
				.setDescription('The Area to Explore')
				.setRequired(true)
				.addChoice('The Abandoned House of Magic', 'witch')
				.addChoice('The Woods of the Howling', 'werewolf')
				.addChoice('The Mansion of the Living', 'frank')
				.addChoice('The Cathedral of Blood', 'vampire')
				.addChoice('The Graveyard of Unfortunate', 'zombie')
				.addChoice('The Coffin of the King', 'skeleton')
				.addChoice('The Church of the Watchers', 'ghost')
				.addChoice('The Road of Haunting Clops', 'headless')
				.addChoice('The Swag Dimension', 'swag')
				.addChoice('The Swamp of Stuffing', 'glob')),

	async execute(interaction, client) {
		// Get Area
		const data = interaction.options.getString('area');

		const areas = new Map([['witch', 0], ['werewolf', 1], ['frank', 2], ['vampire', 3], ['zombie', 4], ['swag', 5], ['skeleton', 12], ['ghost', 13], ['headless', 14], ['glob', 15]]);
		const area = areas.get(data);

		if (area == null) return console.log('fuck');

		const creature_candies = client.creatures[area].candies;
		const area_name = client.creatures[area].area;

		const bucketEmbed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle(interaction.user.username + ' is exploring ' + area_name + '.')
			.setDescription('⠀\nThere could be some candy here' + '!\n⠀');
		try{await interaction.reply({ embeds: [bucketEmbed] }).then(() => client.extra.log_g(client.logger, interaction.guild, 'ToT Command', ' Catching Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'ToT Command', 'Reply Denied');}

		const candies = client.candies.filter(candy => creature_candies.includes(candy.id));

		// Get Bag
		const data_u = await client.pool.query('SELECT candy_bag FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + interaction.user.id + ';');
		const u_bag = data_u.rows[0].candy_bag;

		const quantity = Math.floor(Math.random() * 4) + 1;
		const candy_list_emojis = [];

		for(let x = 0; x < quantity; x++) {
			const temp_candy = candies[Math.floor(Math.random() * candies.length)];
			candy_list_emojis.push(temp_candy.emoji);
			u_bag.push(temp_candy.id);
		}

		await sleep(3000);
		const strings = client.creatures[area].description;
		await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1, collected = collected + $2 WHERE Member_ID = $3;', [u_bag, quantity, interaction.user.id]);
		await client.pool.query('UPDATE guild_stats SET collected = collected + $1, areas_explored = areas_explored + 1 WHERE Guild_ID = $2', [quantity, interaction.guild.id]);
		const bucketEmbed2 = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle(interaction.user.username + ' explored ' + area_name + ' for candy!')
			.setDescription('⠀\n*' + strings[Math.floor(Math.random() * strings.length)] + '*\n\n**__Here is the candy you received__**\n\n' + candy_list_emojis.join(' ') + '\n⠀')
			.setFooter('Make sure to pay attention on the next bunch!');
		try{return await interaction.editReply({ embeds: [bucketEmbed2] }).then(() => client.extra.log_g(client.logger, interaction.guild, 'ToT Command', ' Stole Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'ToT Command', 'Reply Denied');}

	},
};