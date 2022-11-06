const { MessageEmbed } = require('discord.js');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint-disable-next-line no-unused-vars
async function organize_roles(client, channel, guild)
{
	const temp_role = guild.roles.cache.find(r => r.name.toLowerCase() === 'hallow\'s champion');
	const list = guild.members.cache;

	if(temp_role != undefined) {
		const raw_data = await client.pool.query('SELECT * FROM ' + 'g_' + guild.id + ' ORDER BY array_length(candy_bag,1) DESC');
		let data = raw_data.rows;

		// Reduce size if over 100
		if(data.length > 100)
		{
			data = data.slice(0, 100);
		}

		// Eliminate Empty Users
		for(let i = data.length - 1; i > -1; i--)
		{
			try {
				if(data[i].candy_bag.length == 0) {
					data.splice(i, 1);
				}
			} catch {
				break;
			}
		}

		// Get Index of 2nd
		let temp_count = 0;

		for(let i = 1; i < data.length; i++) {
			if(data[0].candy_bag.length != data[i].candy_bag.length) break;
			temp_count++;
		}

		for(let i = 0; i < temp_count + 1; i++) {
			let user = undefined;
			try {
				const raw_user = data[i].member_id;
				const pre_user = list.get(raw_user);
				user = pre_user;
			} catch {
				// eslint-disable-next-line spaced-comment
				//pass
			}

			if(user != undefined) {
				const u_role = user.roles.cache.find(r => r.name.toLowerCase() === 'hallow\'s champion');
				if(u_role == undefined) {
					try {
						await user.roles.add(temp_role);
					} catch {
						const bucketEmbed = new MessageEmbed()
							.setColor('#FFCC00')
							.setTitle('Attention Server Staff!')
							.setDescription('⠀\nLooks like the **Hallows Champion** role is higher than the bot role!\nPlease assign a bot role or the included bot role to have manage channel, messages and role perms to this bot that is higher than **Hallows Champion**.' + '!\n⠀')
							.setFooter('If you encounter anymore problems, please join https://discord.gg/BYVD4AGmYR and tag TheKWitt!');
						// eslint-disable-next-line max-statements-per-line
						try { await channel.send({ embeds: [bucketEmbed] }); } catch{client.extra.log_error_g(client.logger, channel.guild, 'Role Control', 'Warning Reply Denied');}
					}
				}
			}
		}
		for(let i = temp_count + 1; i < data.length; i++) {
			let user = undefined;
			try {
				const raw_user = data[i].member_id;
				const pre_user = list.get(raw_user);
				user = pre_user;
			} catch {
				// eslint-disable-next-line spaced-comment
				//pass
			}

			if(user != undefined) {
				const u_role = user.roles.cache.find(r => r.name.toLowerCase() === 'hallow\'s champion');
				if(u_role != undefined) {
					try {
						await user.roles.remove(temp_role);
					} catch {
						// eslint-disable-next-line spaced-comment
						//pass
					}
				}
			}
		}
	}
}

function getRandom(arr, n) {
	const result = new Array(n);
	let len = arr.length;
	const taken = new Array(len);
	if (n > len) { throw new RangeError('getRandom: more elements taken than available'); }
	while (n--) {
		const x = Math.floor(Math.random() * len);
		result[n] = arr[x in taken ? taken[x] : x];
		taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

function nFormatter(num, digits) {
	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'k' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'B' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' },
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	// eslint-disable-next-line no-shadow
	const item = lookup.slice().reverse().find(function(item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}

async function addGuildStuff(guild, client) {
	await client.pool.query('	CREATE TABLE IF NOT EXISTS g_' + guild.id + '(\
								Member_ID bigint PRIMARY KEY,\
								collected INTEGER DEFAULT 0,\
								candy_bag TEXT[] DEFAULT \'{}\'\
								);');
	await client.pool.query('INSERT INTO guild_settings (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
	await client.pool.query('INSERT INTO guild_stats (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
	const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guild.id]);
	const setting = data.rows[0];
	const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
	client.extra.log(client.logger, guild, 'Guild was recovered and added to database!');
	client.messages.set(guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
}

function simple_log(logger, message) {
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + message + '\n');
}

function log(logger, guild, message) {
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + message + '\n');
}

function log_error(logger, guild, message) {
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | 🔸 ERROR ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + message + '\n');
}

function log_g(logger, guild, message, group) {
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + group + ': ' + message + '\n');
}

function log_error_g(logger, guild, message, group) {
	logger.write('\ufeff' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' | 🔸 ERROR ' + guild.name + ' [' + guild.memberCount + '] (' + guild.id.toString() + ') ' + ' - ' + group + ': ' + message + '\n');
}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

module.exports = { organize_roles, log, log_error, log_g, log_error_g, simple_log, nFormatter, getRandom, random, addGuildStuff, sleep };