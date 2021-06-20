import { NextFunction, Request, Response } from 'express'

import axios, { AxiosError, AxiosResponse } from 'axios'
import { RequestError } from '../middlewares/errorHandler/RequestError'

class LoginController {

	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const login_host: string = process.env.LOGIN_HOST || 'login-service.com'
			const login_url: string = `http://${login_host}`

			const body = req.body
			console.log(login_url)
			axios
				.post(`${login_url}/login`, body)
				.then((data: AxiosResponse) =>
					res
						.status(200)
						.header('auth-token', data.headers['auth-token'])
						.send()
				)
				.catch((err: AxiosError) => {
					if (err.response) {
						// The request was made and the server responded with a status code
						// that falls out of the range of 2xx
						next(new RequestError(err.response.data.message, err.response.status))
					} else if (err.request) {
						// The request was made but no response was received
						// `error.request` is an instance of http.ClientRequest
						next(new RequestError(err.request.data, err.request.status))
					} else {
						// Something happened in setting up the request that triggered an Error
						next(new RequestError('Internal server error', 500))
					}
				})
		} catch (e) {
			next(e)
		}
	}
}

export const loginController: LoginController = new LoginController()
