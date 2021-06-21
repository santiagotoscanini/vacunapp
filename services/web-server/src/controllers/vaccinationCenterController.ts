import { NextFunction, Request, Response } from 'express'
import axios, { AxiosError, AxiosResponse } from 'axios'
import axiosErrorHandler from './helpers/axiosErrorHandler'

class VaccinationCenterController {

	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com'
			const vaccination_center_url: string = `http://${vaccination_center_host}`

			const body = req.body
			axios
				.post(`${vaccination_center_url}/vaccination-centers`, body)
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

	public async createPeriod(req: Request, res: Response, next: NextFunction) {
		try {
			const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com'
			const vaccination_center_url: string = `http://${vaccination_center_host}`

			const body = req.body

			axios
				.post(`${vaccination_center_url}/vaccination-periods`, body)
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

export const vaccinationCenterController: VaccinationCenterController = new VaccinationCenterController()
