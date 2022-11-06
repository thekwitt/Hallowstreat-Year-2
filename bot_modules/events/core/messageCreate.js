const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

async function fuck(message, client, channel_id) {
	const messageSpawn = client.messages.get(message.guild.id);
	if (messageSpawn.get('timestamp') < Math.floor(Date.now() / 1000) && messageSpawn.get('messageCount') <= 1 && messageSpawn.get('activeMessage') == false) {
		// eslint-disable-next-line prefer-const
		let ids = [];
		messageSpawn.set('activeMessage', true);
		client.messages.set(message.guild.id, messageSpawn);
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('Trick')
					.setLabel('Trick')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('Treat')
					.setLabel('Treat')
					.setStyle('PRIMARY'),
			);
		const selects = ['Treat', 'Trick'];
		const winner = selects[Math.floor(Math.random() * selects.length)];

		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [message.guild.id]);
		const setting = data.rows[0];

		let candies = client.candies.filter(candy => candy.emoji != '');
		let embed = new MessageEmbed()
			.setColor(client.colors[0][0])
			.setTitle('A Bunch of Candy suddenly appeared!')
			// eslint-disable-next-line spaced-comment
			//.setThumbnail(user.defaultAvatarURL)
			.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
			.setFooter('You can only get one at a time!')
			.setImage('https://cdn.discordapp.com/attachments/782835367085998080/896615714251747378/bunch_o_candy.png');
		const percent = Math.floor(Math.random() * 20);

		if(percent <= 10) {
			const rand = Math.round(Math.random() * 10);
			// eslint-disable-next-line no-inline-comments
			if(rand == 0) // Suckers
			{
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Suckers suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://cdn.discordapp.com/attachments/782835367085998080/894418632929583184/bunch_o_suckers.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Suckers');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 1) { // Spirals
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Spirals suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://cdn.discordapp.com/attachments/782835367085998080/894418629699993610/bunch_o_spirals.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Swirls');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 2) { // Wraps
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Wraps suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://cdn.discordapp.com/attachments/782835367085998080/896495134529687602/bunch_o_wraps.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Wraps');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 3) { // Jawbreakers
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Jawbreakers suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/782835367085998080/896615776214200340/bunch_o_jawbreakers.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Jawbreakers');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 4) { // Gums
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Gum suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/782835367085998080/896615718894841926/bunch_o_gum.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Gums');
			} else if(rand == 5) { // Banana
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Bananas suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/889230894693482519/900589342622371890/bunch_o_bananas.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Banana');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 6) { // Gummy
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Gummies suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/889230894693482519/900589344274907206/bunch_o_gummy.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Gummy');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 7) { // Choco
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Swag Bars suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/889230894693482519/900589346372071444/bunch_o_swag.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Swag');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 8) { // Chemy
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Chemys suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/889230894693482519/900589347189981194/bunch_o_chews.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Chewy');
			} else if(rand == 9) { // Soda
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Soda suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/889230894693482519/900589348448251934/bunch_o_soda.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Soda');
			// eslint-disable-next-line no-inline-comments
			} else if(rand == 10) { // Corn
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('A Bunch of Candy Corn suddenly appeared!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nLook at all this candy! Press the **' + winner + '** button to get it!\n⠀')
					.setFooter('You can only get one at a time!')
					.setImage('https://media.discordapp.net/attachments/889230894693482519/900589349119336468/bunch_o_corn.png');
				candies = client.candies.filter(candy => candy.emoji != '' && candy.type === 'Corn');
			}
		}
		let channel = undefined;
		channel = await message.guild.channels.cache.get(channel_id.toString());
		let interactionMessage = undefined;
		try{interactionMessage = await channel.send({ embeds: [embed], components: [row] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'First Send'));}
		catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Send Denied');}
		await client.pool.query('UPDATE guild_stats SET messages_spawned = messages_spawned + 1 WHERE Guild_ID = $1', [message.guild.id]);
		if(interactionMessage == undefined) return ;

		const filter = i => {
			return i.message.id == interactionMessage.id;
		};

		const collector = await channel.createMessageComponentCollector({ filter, time: 60000, maxUsers: setting.obtain_amount });
		collector.on('collect', async i => {
			await client.pool.query('INSERT INTO g_' + i.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [i.user.id]);
			if (ids.includes(i.user.id)) {
				try{await i.reply({ content: 'You already tried to get candy!', ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Already Candy Reply'));}
				catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied');}
			}
			else if (collector.users.size > setting.obtain_amount) {
				try{await i.reply({ content: 'Oh no! You were too late! Someone grabbed the last piece of candy.', ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Too Late Candy Reply'));}
				catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied');}
			}
			else if (i.customId === winner) {
				ids.push(i.user.id);
				const quantity = Math.floor(Math.random() * 4) + 1;
				const candy_list_emojis = [];
				const candy_list_ids = [];
				for(let x = 0; x < quantity; x++) {
					const temp_candy = candies[Math.floor(Math.random() * candies.length)];
					candy_list_emojis.push(temp_candy.emoji);
					candy_list_ids.push(temp_candy.id);
				}
				try { await client.pool.query('UPDATE g_' + message.guild.id + ' SET candy_bag = array_cat(candy_bag,$1), collected = collected + $2 WHERE Member_ID = $3;', [candy_list_ids, quantity, i.user.id]); }
				// eslint-disable-next-line max-statements-per-line
				catch { client.extra.addGuildStuff(message.guild, client); client.extra.log_error_g(client.logger, message.guild, 'Interaction Create', 'Insert Member Denied'); await client.extra.sleep(3000); client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Retry Operation'); await client.pool.query('INSERT INTO g_' + message.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [message.author.id]);}
				await client.pool.query('UPDATE guild_stats SET collected = collected + $1 WHERE Guild_ID = $2', [quantity, message.guild.id]);
				const strings = ['The candy happily bounced out of the bunch and landed in your hand!', 'You stare deeply into the bag and grab the best looking piece of candy you could find.', 'You closed your eyes and grabbed the closest candy from the bunch.'];
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('Awesome! You got some candy!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\n*' + strings[Math.floor(Math.random() * strings.length)] + '*\n\n**__Here is the candy you received__**\n\n' + candy_list_emojis.join(' ') + '\n⠀')
					.setFooter('Make sure to pay attention on the next bunch!');
				try{await i.reply({ embeds: [embed], ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', i.user.username + ' - Candy Reply'));}
				catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied');}

			}
			else {
				ids.push(i.user.id);
				const user_bag = await client.pool.query('SELECT * FROM g_' + i.guild.id + ' WHERE Member_ID = ' + i.user.id + ';');
				const candy_bag = user_bag.rows[0].candy_bag;

				const rand = Math.round(Math.random() * 101);
				if(candy_bag.length != 0) {

					if(rand >= 25) {
						const strings = ['You picked up the candy but a crow flew by and grabbed it from you!', 'You grab and accidently dropped the candy and it exploded on the ground!', 'The candy ran away from you as soon as you grabbed it!', 'You fell face first while trying to pick up the candy.'];
						embed = new MessageEmbed()
							.setColor(client.colors[0][1])
							.setTitle('Oh no! You picked the wrong choice!')
							// eslint-disable-next-line spaced-comment
							//.setThumbnail(user.defaultAvatarURL)
							.setDescription('⠀\n*' + strings[Math.floor(Math.random() * strings.length)] + '*\n⠀')
							.setFooter('Make sure to pay attention on the next bunch!');
						try{await i.reply({ embeds: [embed], ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Candy Failed 2 Reply'));}
						catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied');}
					} else if (rand < 25) {
						const strings = ['You picked up the candy but a crow flew by and stole your candy while you weren\'t looking!', 'While trying to grab the candy, a spider lands on your hand and scares you! You lost some of your candy from the startle!', 'The candy in your bag got jealous and hopped out to find a new owner.', 'You fell face first while trying to pick up the candy and spilled some of your own!'];
						if(candy_bag.length >= 3) {
							const suffer = Math.round(Math.random() * 2) + 1;
							for(let x = 0; x < suffer; x++)
							{
								candy_bag.splice(Math.floor(Math.random() * candy_bag.length), 1);
							}
							embed = new MessageEmbed()
								.setColor(client.colors[0][1])
								.setTitle('Oh no! You picked the wrong choice and lost some candy!')
								// eslint-disable-next-line spaced-comment
								//.setThumbnail(user.defaultAvatarURL)
								.setDescription('⠀\n*' + strings[Math.floor(Math.random() * strings.length)] + '*\n⠀')
								.setFooter('Make sure to pay attention on the next bunch!');
							try{await i.reply({ embeds: [embed], ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Candy Failed 3 Reply'));}
							catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied');}
							await client.pool.query('UPDATE g_' + i.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2;', [candy_bag, i.user.id]);
						} else {
							const suffer = Math.round(Math.random() * (candy_bag.length - 1)) + 1;
							for(let x = 0; x < suffer; x++)
							{
								candy_bag.splice(Math.floor(Math.random() * candy_bag.length), 1);
							}
							embed = new MessageEmbed()
								.setColor(client.colors[0][1])
								.setTitle('Oh no! You picked the wrong choice and lost some candy!')
								// eslint-disable-next-line spaced-comment
								//.setThumbnail(user.defaultAvatarURL)
								.setDescription('⠀\n*' + strings[Math.floor(Math.random() * strings.length)] + '*\n⠀')
								.setFooter('Make sure to pay attention on the next bunch!');
							try{await i.reply({ embeds: [embed], ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Candy Failed 4 Reply'));}
							catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied');}
							await client.pool.query('UPDATE g_' + i.guild.id + ' SET candy_bag = $1 WHERE Member_ID = $2;', [candy_bag, i.user.id]);
						}

					}
				} else {
					const strings = ['You picked up the candy but a crow flew by and grabbed it from you!', 'You grab and accidently dropped the candy and it exploded on the ground!', 'The candy ran away from you as soon as you grabbed it!', 'You fell face first while trying to pick up the candy.'];
					embed = new MessageEmbed()
						.setColor(client.colors[0][1])
						.setTitle('Oh no! You picked the wrong choice!')
						// eslint-disable-next-line spaced-comment
						//.setThumbnail(user.defaultAvatarURL)
						.setDescription('⠀\n*' + strings[Math.floor(Math.random() * strings.length)] + '*\n⠀')
						.setFooter('Make sure to pay attention on the next bunch!');

					try{await i.reply({ embeds: [embed], ephemeral: true }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Candy Failed 5 Reply'));}
					catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Reply Denied');}

				}
			}

		});
		// eslint-disable-next-line no-unused-vars
		collector.on('end', async i => {
			if(collector.users.size < setting.obtain_amount) {
				const finishRow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('Trick')
							.setLabel('Trick')
							.setStyle('PRIMARY')
							.setDisabled(true),
					)
					.addComponents(
						new MessageButton()
							.setCustomId('Treat')
							.setLabel('Treat')
							.setStyle('PRIMARY')
							.setDisabled(true),
					);
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('The remaining candy vanished!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nKeep on talking for another one to appear!\n⠀')
					.setFooter('Each bunch only lasts 60 seconds!');
				try{await interactionMessage.edit({ embeds: [embed], components: [finishRow] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Expired Edit'));}
				catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}
			}
			else {
				const finishRow = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('Trick')
							.setLabel('Trick')
							.setStyle('PRIMARY')
							.setDisabled(true),
					)
					.addComponents(
						new MessageButton()
							.setCustomId('Treat')
							.setLabel('Treat')
							.setStyle('PRIMARY')
							.setDisabled(true),
					);
				embed = new MessageEmbed()
					.setColor(client.colors[0][1])
					.setTitle('Everyone took from the bunch!')
					// eslint-disable-next-line spaced-comment
					//.setThumbnail(user.defaultAvatarURL)
					.setDescription('⠀\nKeep on talking for another one to appear!\n⠀')
					.setFooter('Each bunch only lasts 60 seconds!');
				try{await interactionMessage.edit({ embeds: [embed], components: [finishRow] }).then(client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Empty Edit'));}
				catch{client.extra.log_error_g(client.logger, message.guild, 'Message Create Event', 'Edit Denied');}
			}
			await client.extra.organize_roles(client, message.channel, message.guild);
			messageSpawn.set('messageCount', setting.message_count).set('timestamp', Math.floor(Date.now() / 1000) + setting.message_interval).set('activeMessage', false);
			client.messages.set(message.guild.id, messageSpawn);
		});
	}
	else {
		messageSpawn.set('messageCount', messageSpawn.get('messageCount') - 1);
		client.messages.set(message.guild.id, messageSpawn);
	}
}

module.exports = {
	name: 'messageCreate',
	async execute(message, client) {
		if(!message.deleted && message.member != null)
		{
			try { await client.pool.query('INSERT INTO g_' + message.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [message.author.id]); }
			// eslint-disable-next-line max-statements-per-line
			catch { client.extra.addGuildStuff(message.guild, client); client.extra.log_error_g(client.logger, message.guild, 'Interaction Create', 'Insert Member Denied'); await client.extra.sleep(3000); client.extra.log_g(client.logger, message.guild, 'Message Create Event', 'Retry Operation'); await client.pool.query('INSERT INTO g_' + message.guild.id + ' (Member_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [message.author.id]);}
			const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [message.guild.id]);
			const setting = data.rows[0];

			// Check Channel ID
			const list = message.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT');
			if(!list.has(setting.channel_set) && setting.channel_set != 0) {

				await client.pool.query('UPDATE guild_settings SET channel_set = 0 WHERE Guild_ID = $1', [message.guild.id]);
			}

			if(setting.channel_set != 0) {
				if(setting.trigger_outside) {
					if(client.ready == true && message.member.user.bot == false) {
						await fuck(message, client, setting.channel_set);
					}
				} else if (message.channel.id == setting.channel_set) {
					if(client.ready == true && message.member.user.bot == false) {
						await fuck(message, client, setting.channel_set);
					}
				}
			}
		}
	},
};