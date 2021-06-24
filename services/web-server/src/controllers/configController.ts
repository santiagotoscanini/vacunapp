import { NextFunction, Request, Response } from 'express'
import axios, { AxiosError, AxiosResponse } from 'axios'
import axiosErrorHandler from './helpers/axiosErrorHandler'

class ConfigController {
	public async changeAlgorithm(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com'
			const vaccination_center_url: string = `http://${vaccination_center_host}`
			const body = req.body

			axios
				.post(`${vaccination_center_url}/config/algorithm`, body)
				.then((data: AxiosResponse) =>
					res
						.status(201)
						.send(data.data)
				)
				.catch((err: AxiosError) => axiosErrorHandler(err, next))
		} catch (e) {
			next(e)
		}
	}


	public async fetchAlgorithms(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com'
			const vaccination_center_url: string = `http://${vaccination_center_host}`

			axios
				.get(`${vaccination_center_url}/config/algorithm`)
				.then((data: AxiosResponse) =>
					res
						.status(201)
						.send(data.data)
				)
				.catch((err: AxiosError) => axiosErrorHandler(err, next))
		} catch (e) {
			next(e)
		}
	}

	public async changeSmsUrl(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com'
			const vaccination_center_url: string = `http://${vaccination_center_host}`
			const body = req.body

			axios
				.post(`${vaccination_center_url}/config/sms`, body)
				.then((data: AxiosResponse) =>
					res
						.status(201)
						.send(data.data)
				)
				.catch((err: AxiosError) => axiosErrorHandler(err, next))
		} catch (e) {
			next(e)
		}
	}

	public async changeIdProviderUrl(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com'
			const vaccination_center_url: string = `http://${vaccination_center_host}`
			const body = req.body

			axios
				.post(`${vaccination_center_url}/config/id-provider`, body)
				.then((data: AxiosResponse) =>
					res
						.status(201)
						.send(data.data)
				)
				.catch((err: AxiosError) => axiosErrorHandler(err, next))
		} catch (e) {
			next(e)
		}
	}
}

export default new ConfigController()
