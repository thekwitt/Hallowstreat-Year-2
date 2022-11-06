/* eslint-disable max-statements-per-line */
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token, poolUser, poolPW } = require('./token.json');
const { Pool } = require('pg');
const extra = require('./extra_script');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.logger = fs.createWriteStream('./logs/' + Date.now() + '.txt', { flags : 'w' });
client.commands = new Collection();
client.colors = [['#FE9600', '#F56F16', '#DE4033']];
client.commands_array = [];
client.messages = new Collection();
client.ready = false;
client.extra = extra;
const database = require('./bot_modules/json/candy.json');
const effects = require('./bot_modules/json/eating.json');

client.candies = database.candy;
client.creatures = database.creatures;
client.effects = effects.effect;

console.log(client.creatures[10].name);


const pool = new Pool({
	database: 'halloween',
	user: poolUser,
	password: poolPW,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

const pgtools = require('pgtools');
pgtools.createdb({
	user: poolUser,
	password: poolPW,
}, 'halloween', function(err, res) {
	if (err) {
		console.error('This db already exists');
	}
	else {
		console.log('New Database Made' + res);
	}
});

client.pool = pool;


['Commands'].forEach(handler => {
	require('./bot_modules/handlers/' + handler)(client, token);
});


// Events
fs.readdirSync('./bot_modules/events/').forEach((dir) => {
	const eventFiles = fs
		.readdirSync(`./bot_modules/events/${dir}/`)
		.filter((file) => file.endsWith('.js'));
	eventFiles.forEach(async (file) => {
		const event = require(`./bot_modules/events/${dir}/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	});
});
/*
// Commands
fs.readdirSync('./bot_modules/commands/').forEach((dir) => {
	const commandFiles = fs
		.readdirSync(`./bot_modules/commands/${dir}/`)
		.filter((file) => file.endsWith('.js'));
	commandFiles.forEach(async (file) => {
		const command = require(`./bot_modules/commands/${dir}/${file}`);
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	});
});
*/

/*
ap.on('posted', () => {
	client.extra.simple_log(client.logger, 'Top.gg stats posted!');
});
*/
async function status() {
	if(client.ready == true)
	{
		const data = await client.pool.query('SELECT SUM(collected) AS collect, SUM(candy_stolen) AS stolen, SUM(given) AS give FROM guild_stats');
		const stats = data.rows[0];
		// eslint-disable-next-line max-statements-per-line
		const rand = client.extra.random(0, 2);
		let firstPart = client.guilds.cache.size + ' servers';
		if(client.extra.random(0, 100) % 2 == 1) firstPart = client.extra.nFormatter(client.guilds.cache.reduce((sum, g) => sum + g.memberCount, 0)).toString() + ' members ';

		if(rand == 0) try{ await client.user.setActivity(firstPart + ' collect ' + client.extra.nFormatter(stats.collect, 1) + ' candy!', { type: 'WATCHING' });} catch {console.error;}
		else if(rand == 1) try{ await client.user.setActivity(firstPart + ' servers steal ' + client.extra.nFormatter(stats.stolen, 1) + ' candy!', { type: 'WATCHING' });} catch {console.error;}
		else if(rand == 2) try{ await client.user.setActivity(firstPart + ' servers give ' + client.extra.nFormatter(stats.give, 1) + ' candy!', { type: 'WATCHING' });} catch {console.error;}
	}
}

setInterval(async function() {status();}, 360000);

client.login(token);