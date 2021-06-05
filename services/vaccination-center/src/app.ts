import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

import VaccinationCentersRoutes from './routes/vaccination.center.routes';

export class App {
	private app: Application;

	constructor(private port?: number | string) {
		this.app = express();
		this.settings();
		this.middlewares();
		this.routes();
	}

	settings() {
		this.app.set('port', this.port || process.env.PORT || 3001);
	}

	middlewares() {
		this.loggingMiddleware();
		this.app.use(express.json());
	}

	loggingMiddleware() {
		if (process.env.NODE_ENV == 'production') {
			const morganLogStream = fs.createWriteStream(path.join(__dirname, '/../morgan.log'), { flags: 'a' });

			this.app.use(morgan('common', {
				skip: (req: Request, res: Response) => {
					return res.statusCode < 400;
				}, stream: morganLogStream
			}));
		} else {
			this.app.use(morgan('dev'));
		}
	}

	routes() {
		this.app.use('/vaccination-centers', VaccinationCentersRoutes);
	}

	async listen() {
		await this.app.listen(this.app.get('port'));
	}
}
