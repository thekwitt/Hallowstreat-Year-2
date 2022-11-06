const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'steal',
	description: 'Try to steal someone\'s candy from their bag!',
	cooldown: 1800,
	data: new SlashCommandBuilder()
		.setName('steal')
		.setDescription('Try to steal someone\'s candy from their bag!')
		.addUserOption(option => option.setName('target').setDescription('The user to steal from.').setRequired(true)),
	async execute(interaction, client) {
		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [interaction.guild.id]);
		const setting = data.rows[0];

		if (setting.enable_steal)
		{
			const target = interaction.options.getUser('target');
			try { if (target.id == interaction.user.id) return await interaction.reply({ content: 'You cannot steal from yourself!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Steal Command', 'Duplicate Reply')); }
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Steal Command', 'Reply Denied'); }

			try{
				if (!target.bot) await client.pool.query('INSERT INTO g_' + interaction.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [target.id]);
				else return await interaction.reply(target.username + ' is a bot. It doesn\'t like candy.').then(client.extra.log_g(client.logger, interaction.guild, 'Steal Command', 'Bot Warning Reply'));
			} catch { client.extra.log_error_g(client.logger, interaction.guild, 'Steal Command', 'Reply Denied'); }
			const percent = Math.floor(Math.random() * 101);
			const data_u = await client.pool.query('SELECT candy_bag FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + interaction.user.id + ';');
			const u_bag = data_u.rows[0].candy_bag;
			const data_t = await client.pool.query('SELECT candy_bag FROM g_' + interaction.guild.id + ' WHERE Member_ID = ' + target.id + ';');
			const t_bag = data_t.rows[0].candy_bag;
			// No Steal
			if(percent > 70) {
				const steal_text = ['**' + target.username + '** slapped **' + interaction.user.username + '** before they could grab any candy!', '**' + target.username + '** tripped **' + interaction.user.username + '** and laughed at their minimal attempt to steal their candy!', '**' + target.username + '** threw bones at **' + interaction.user.username + '** before they could steal anything!'];
				const embed = new MessageEmbed()
					.setColor(client.colors[0][2])
					.setTitle(interaction.user.username + ' failed to steal from ' + target.username + '!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n' + steal_text[Math.floor(Math.random() * steal_text.length)] + '\n⠀')
					.setFooter('You can steal again in thirty minutes!');
				try	{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Steal Command', 'failed Warning Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Steal Command', 'Reply Denied');}
			}
			else {
				if(t_bag.length == 0) {
					// eslint-disable-next-line no-unused-vars
					const embed = new MessageEmbed()
						.setColor(client.colors[0][2])
						.setTitle(interaction.user.username + ' tried to steal ' + target.username + '\'s empty candy bag!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n' + 'Shun ' + interaction.user.username + ' for stealing from a poor candy collector!' + '\n⠀')
						.setFooter('Pick someone who has candy next time!');
					try	{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Steal Command', 'Empty Warning Reply'));}
					catch{client.extra.log_error_g(client.logger, interaction.guild, 'Steal Command', 'Reply Denied');}
				}
				const rand = Math.floor(Math.random() * 4) + 1;
				for(let i = 0; i < rand; i++)
				{
					const candy = t_bag[Math.floor(Math.random() * t_bag.length)];
					t_bag.splice(t_bag.indexOf(candy), 1);
					u_bag.push(candy);
					if(t_bag.length == 0) break;
				}
				const c_text = ['a piece of candy', 'a couple pieces of candy', 'a few pieces of candy', 'a bunch of pieces of candy', 'a bunch of pieces of candy', 'a bunch of pieces of candy', 'a bunch of pieces of candy'];
				const steal_text = ['**' + interaction.user.username + '** grabbed the candy from **' + target.username + '\'s** candy bag! What a psycho!', '**' + interaction.user.username + '** cut a hole in **' + target.username + '\'s** candy bag and grabbed the leaking candy!', '**' + target.username + '** was distracted and got their candy stolen by **' + interaction.user.username + '**!', '**' + interaction.user.username + '** threw bones at **' + target.username + '** which caused them to run away!'];
				await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2;', [u_bag, interaction.user.id]);
				await client.pool.query('UPDATE g_' + interaction.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2;', [t_bag, target.id]);
				await client.pool.query('UPDATE guild_stats SET candy_stolen = candy_stolen + $1 WHERE Guild_ID = $2', [rand, interaction.guild.id]);
				const embed = new MessageEmbed()
					.setColor(client.colors[0][2])
					.setTitle(interaction.user.username + ' stole ' + c_text[rand - 1] + ' from ' + target.username + '!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n' + steal_text[Math.floor(Math.random() * steal_text.length)] + '\n⠀')
					.setFooter('You can steal again in thirty minutes!');
				try{return await interaction.reply({ embeds: [embed] }).then(client.extra.log_g(client.logger, interaction.guild, 'Steal Command', ' Stole Reply'));}
				catch{client.extra.log_error_g(client.logger, interaction.guild, 'Steal Command', 'Reply Denied');}
			}
		} else {
			try{return await interaction.reply({ content: 'Looks like the server disabled stealing!', ephemeral: true }).then(client.extra.log_g(client.logger, interaction.guild, 'Steal Command', 'Disabled Reply'));}
			catch{client.extra.log_error_g(client.logger, interaction.guild, 'Stealing Command', 'Disable Reply Denied');}
		}

	},
};