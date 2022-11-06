const { registerFont, createCanvas, loadImage } = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

// eslint-disable-next-line no-unused-vars

function return_title(num) {
	const nums = [0, 100, 200, 400, 600, 1000, 1500, 2000, 3000, 4000, 5000, 10000];
	const titles = ['Candy Eater', 'Candy Collector', 'Candy Venturer', 'Candy Adventurer', 'Candy Mercenary', 'Candy Crusader', 'Candy Daredevil', 'Candy Hero', 'Candy Knight', 'Candy Hallower', 'I Am Candy'];

	for(let i = nums.length - 1; i >= 0; i--) {
		if (num >= nums[i]) {
			return titles[i];
		}
	}
}


module.exports = {
	name: 'card',
	description: 'View the user\'s halloween card.',
	cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('card')
		.setDescription('View the user\'s halloween card.')
		.addUserOption(option => option.setName('target').setDescription('The card of that user.')),
	// eslint-disable-next-line no-unused-vars
	async execute(interaction, client) {
		const raw_data = await client.pool.query('SELECT * FROM ' + 'g_' + interaction.guild.id + ' ORDER BY array_length(candy_bag,1) DESC');
		let d = raw_data.rows;

		let user_index = 0;

		// Eliminate Empty Users
		for(let i = d.length - 1; i > -1; i--)
		{
			try {
				if(d[i].candy_bag.length == 0) {
					d.splice(i, 1);
				}
			} catch {
				break;
			}
		}

		// Reduce size if over 100
		if(d.length > 100)
		{
			d = d.slice(0, 100);
		}

		const target = interaction.options.getUser('target');
		let user = interaction.user;
		if (target != undefined) {user = target;}
		// Get User Index
		for(user_index; user_index < d.length; user_index++)
		{
			if(user.id == d[user_index].member_id) break;
		}


		if (target && !target.bot)
		{
			user = target;
			await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [target.id]);
		}
		else if (target && target.bot) {
			try{return await interaction.reply(target.username + ' is a bot. It doesn\'t like candy.').then(client.extra.log_g(client.logger, interaction.guild, 'Card Command', 'Bot Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Card Command', 'Reply Denied');}
		}

		const user_bag = await client.pool.query('SELECT * FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + user.id + ';');

		const candy_bag = user_bag.rows[0].candy_bag;

		const data = [...new Set(candy_bag)].sort();

		registerFont('./card/Count.ttf', { family: 'name' });
		registerFont('./card/Points.ttf', { family: 'points' });
		registerFont('./card/Rank.ttf', { family: 'ranks' });
		registerFont('./card/Title.ttf', { family: 'title' });
		registerFont('./card/Server.ttf', { family: 'server' });

		const canvas = createCanvas(1200, 500);
		const context = canvas.getContext('2d');
		const background = await loadImage('./card/Card.png');

		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.fillStyle = '#cc633a';
		context.font = '60px title';
		context.fillStyle = '#ffffff';
		context.fillText(user.username, 185, 88);

		context.fillStyle = '#ce5a2c';
		context.font = '32px "ranks"';
		context.fillStyle = '#ffffff';
		context.fillText(return_title(user_bag.rows[0].collected), 185, 143);

		context.fillStyle = '#c4572c';
		context.font = '50px points';
		context.fillStyle = '#ffffff';
		context.fillText('Bag - ' + client.extra.nFormatter(candy_bag.length), 40, 320);

		context.fillStyle = '#c4572c';
		context.font = '50px points';
		context.fillStyle = '#ffffff';
		context.fillText('Unique - ' + client.extra.nFormatter(data.length).toString() + '/' + client.candies.filter(candy => candy.emoji != '').length, 40, 390);

		context.fillStyle = '#b24d26';
		context.font = '50px points';
		context.fillStyle = '#ffffff';
		context.fillText('Collected ' + client.extra.nFormatter(user_bag.rows[0].collected).toString() + ' candy ', 40, 460);


		context.fillStyle = '#e29e83';
		context.font = '60px name';
		context.fillStyle = '#ffffff';
		if(d.length == 0) {
			context.fillText('Unranked', 820, 460);
		} else {
			context.fillText('Rank: ' + (user_index + 1).toString().padStart(4, '0') + '', 810, 460);
		}

		context.fillStyle = '#6d1f00';
		context.font = '48px server';
		context.fillStyle = '#ffffff';
		context.textAlign = 'right';
		context.fillText(interaction.guild.name, 1155, 80);

		context.beginPath();
		context.arc(95, 95, 65, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();

		const avatar = await loadImage(user.displayAvatarURL({ format: 'jpg' }));
		context.drawImage(avatar, 30, 30, 130, 130);

		// End
		const attachment = new MessageAttachment(canvas.toBuffer(), user.username + '_' + Date.now().toString() + '.png');

		try{await interaction.reply({ files: [attachment] }).then(client.extra.log_g(client.logger, interaction.guild, 'Card Command', 'Bot Reply'));}
		catch{client.extra.log_error_g(client.logger, interaction.guild, 'Card Command', 'Reply Denied');}

	},
};