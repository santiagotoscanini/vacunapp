import express, { Application, Request, Response } from 'express'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'

import VaccinationCentersRoutes from './routes/vaccination-center.routes'
import VaccinationPeriodsRoutes from './routes/vaccination-period.routes'
import ReserveRoutes from './routes/reserve.routes'
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
		this.app.use('/vaccination-centers', VaccinationCentersRoutes)
		this.app.use('/vaccination-periods', VaccinationPeriodsRoutes)
		this.app.use('/reserves', ReserveRoutes)
	}

	postMiddlewares() {
		this.app.use(errorHandler)
	}

	async listen() {
		await this.app.listen(this.app.get('port'))
		console.log('App start listening on ', this.app.get('port'))
	}
}
