module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_SCHEMA,
		host: process.env.DB_HOST
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_SCHEMA,
		host: process.env.DB_HOST
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_SCHEMA,
		host: process.env.DB_HOST
	}
};
