import { NextFunction, Request, Response } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { RequestError } from '../middlewares/errorHandler/RequestError';

class VaccinationCenterController {

	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com';
			const vaccination_center_url: string = `http://${vaccination_center_host}`;

			const body = req.body;
			axios
				.post(`${vaccination_center_url}/vaccination-centers`, body)
				.then((data: AxiosResponse) =>
					res
						.status(201)
						.send(data.data)
				)
				.catch((err: AxiosError) => {
					if (err.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						next(new RequestError(err.response.data.message, err.response.status));
					} else if (err.request) {
						// The request was made but no response was received
						// `error.request` is an instance of http.ClientRequest
						next(new RequestError(err.request.data, err.request.status));
					} else {
						// Something happened in setting up the request that triggered an Error
						next(new RequestError('Internal server error', 500));
					}
				});

		} catch (e) {
			next(e);
		}
	}

	public async createPeriod(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com';
			const vaccination_center_url: string = `http://${vaccination_center_host}`;

			const body = req.body;

			axios
				.post(`${vaccination_center_url}/vaccination-periods`, body)
				.then((data: AxiosResponse) =>
					res
						.status(201)
						.send(data.data)
				)
				.catch((err: AxiosError) => {
					if (err.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						next(new RequestError(err.response.data.message, err.response.status));
					} else if (err.request) {
						// The request was made but no response was received
						// `error.request` is an instance of http.ClientRequest
						next(new RequestError(err.request.data, err.request.status));
					} else {
						// Something happened in setting up the request that triggered an Error
						next(new RequestError('Internal server error', 500));
					}
				});
		} catch (e) {
			next(e);
		}
	}
}

export const vaccinationCenterController: VaccinationCenterController = new VaccinationCenterController();
