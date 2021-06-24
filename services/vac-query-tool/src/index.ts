import { App } from './app'

import connectDB from './database/config'

async function main() {
	await connectDB()

	const app = new App()
	await app.listen()
}

main()
