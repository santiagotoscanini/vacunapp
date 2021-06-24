import { App } from './app'

import connectDB from './database/config'
import SeedMongoDb from './database/seeders/SeedMongoDb'

async function main() {
	await connectDB()
	new SeedMongoDb()

	const app = new App()
	await app.listen()
}

main()
