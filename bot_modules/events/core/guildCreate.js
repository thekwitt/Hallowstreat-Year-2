module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
		await client.pool.query('CREATE TABLE IF NOT EXISTS g_' + guild.id + '(\
							Member_ID bigint PRIMARY KEY,\
							collected INTEGER DEFAULT 0,\
							candy_bag TEXT[] DEFAULT \'{}\',\
							effect_id INTEGER DEFAULT 0\
							);');
		await client.pool.query('INSERT INTO guild_settings (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
		await client.pool.query('INSERT INTO guild_stats (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
		const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guild.id]);
		const setting = data.rows[0];
		const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
		client.extra.log(client.logger, guild, ' Joined the Database!');
		client.messages.set(guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
	},
};