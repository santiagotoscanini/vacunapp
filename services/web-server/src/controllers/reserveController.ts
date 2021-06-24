import { NextFunction, Request, Response } from 'express'
import axios, { AxiosError, AxiosResponse } from 'axios'
import axiosErrorHandler from './helpers/axiosErrorHandler'

class ReserveController {
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const reserve_host: string = process.env.RESERVE_HOST || 'reserve-service.com'
			const reserve_url: string = `http://${reserve_host}`
			const body = req.body

			axios
				.post(`${reserve_url}/reserves`, body)
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

	public async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const reserve_host: string = process.env.RESERVE_HOST || 'reserve-service.com'
			const reserve_url: string = `http://${reserve_host}`
			axios
				.delete(`${reserve_url}/reserves`, { params: {
						userId: req.query.userId?.toString(),
						reserveId: req.query.reserveId?.toString()
					} })
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

	public async read(req: Request, res: Response, next: NextFunction) {
		try {
			const reserve_host: string = process.env.RESERVE_HOST || 'reserve-service.com'
			const reserve_url: string = `http://${reserve_host}`
			axios
				.get(`${reserve_url}/reserves`, { params: {
						userId: req.query.userId?.toString(),
						reserveId: req.query.reserveId?.toString()
					} })
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

export default new ReserveController()
