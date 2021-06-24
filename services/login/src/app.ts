import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'

import LoginRoutes from './routes/login.routes'
import errorHandler from './middlewares/errorHandler/errorHandler'

export class App {
	private app: Application

	constructor(private port?: number | string) {
		this.app = express()
		this.settings()
		this.preMiddlewares()
		this.routes()
		this.postMiddlewares()
	}

	settings() {
		this.app.set('port', this.port || process.env.PORT || 80)
	}

	preMiddlewares() {
		if (process.env.NODE_ENV == 'production') {
			const morganLogStream = fs.createWriteStream(path.join(__dirname, '/../morgan.log'), { flags: 'a' })

			this.app.use(morgan('common', {
				skip: (req: Request, res: Response) => {
					return res.statusCode < 400
				}, stream: morganLogStream
			}))
		} else {
			this.app.use(morgan('dev'))
		}

		this.app.use(express.json())
	}

	routes() {
		this.app.use('/login', LoginRoutes)
	}

	postMiddlewares() {
		this.app.use(errorHandler)
	}

	async listen() {
		await this.app.listen(this.app.get('port'))
		console.log('App start listening on ', this.app.get('port'))
	}
}
