import { connect } from 'mongoose';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const mongoURI: string = `mongodb://${config.username}:${config.password}@${config.host}/${config.database}?authSource=admin`;

const connectDB = async () => {
	try {
		await connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
		console.info('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

export default connectDB;
