module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		await client.pool.query('	CREATE TABLE IF NOT EXISTS guild_settings(\
									Guild_ID bigint PRIMARY KEY,\
									Channel_Set bigint DEFAULT 0,\
									Trigger_Outside BOOLEAN DEFAULT FALSE,\
									Message_Count INTEGER DEFAULT 10,\
									Obtain_Amount INTEGER DEFAULT 1,\
									Message_Interval INTEGER DEFAULT 300,\
									enable_steal BOOLEAN DEFAULT TRUE\
									);');
		await client.pool.query('	CREATE TABLE IF NOT EXISTS guild_stats(\
									Guild_ID bigint PRIMARY KEY,\
									Collected INTEGER DEFAULT 0,\
									Given INTEGER DEFAULT 0,\
									Messages_Spawned INTEGER DEFAULT 0,\
									Areas_Explored INTEGER DEFAULT 0,\
									Candy_Stolen INTEGER DEFAULT 0\
									);');

		for(const g of await client.guilds.fetch()) {
			const guild = g[1];
			await client.pool.query('CREATE TABLE IF NOT EXISTS g_' + guild.id + '(\
								Member_ID bigint PRIMARY KEY,\
								collected INTEGER DEFAULT 0,\
								candy_bag TEXT[] DEFAULT \'{}\'\
								);');
			await client.pool.query('INSERT INTO guild_settings (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
			await client.pool.query('INSERT INTO guild_stats (Guild_ID) VALUES ($1) ON CONFLICT DO NOTHING;', [guild.id]);
			const data = await client.pool.query('SELECT * FROM guild_settings WHERE Guild_ID = $1', [guild.id]);
			const setting = data.rows[0];
			const timestamp = Math.floor(Date.now() / 1000) + setting.message_interval;
			client.messages.set(guild.id, new Map([['messageCount', setting.message_count], ['timestamp', timestamp], ['activeMessage', false]]));
		}
		const data = await client.pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema not in (\'information_schema\', \'pg_catalog\') and table_type = \'BASE TABLE\';');
		const servers = data.rows;

		for(const n of servers) {
			const name = n.table_name;
			if(name != 'guild_settings' && name != 'guild_stats') {
				await client.pool.query('ALTER TABLE ' + name + ' ADD COLUMN IF NOT EXISTS effect INTEGER DEFAULT 0;');
				await client.pool.query('ALTER TABLE ' + name + ' ADD COLUMN IF NOT EXISTS effect_cd INTEGER DEFAULT 0;');
			}
		}

		const guild = client.guilds.cache.find(g => g.id == '815055837181378560');
		await guild.commands.set([]).then(console.log).catch(console.error);
		await guild.members.fetch();
		client.ready = true;
		client.extra.simple_log(client.logger, 'Bot is ready');
	},
};