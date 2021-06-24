import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import errorHandler from './middlewares/errorHandler/errorHandler'
import AppliedVaccinesRoutes from './routes/applied-vaccines.routes'
import PendingReservesRoutes from './routes/pending-reserves.routes'

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
		this.loggingMiddleware()
		this.app.use(express.json())
	}

	loggingMiddleware() {
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
	}

	routes() {
		this.app.use('/applied-vaccines', AppliedVaccinesRoutes)
		this.app.use('/pending-reserves', PendingReservesRoutes)
	}

	postMiddlewares() {
		this.app.use(errorHandler)
	}

	async listen() {
		await this.app.listen(this.app.get('port'))
		console.log('App start listening on ', this.app.get('port'))
	}
}
