import { connect } from 'mongoose'

const config = require('./config.js')
const mongoURI: string = `mongodb://${config.username}:${config.password}@${config.host}/${config.database}?authSource=admin`

const connectDB = async () => {
	try {
		await connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
		console.info('MongoDB Connected...')
	} catch (err) {
		console.error(err.message)
		process.exit(1)
	}
}

export default connectDB
