import { NextFunction, Request, Response } from 'express'

import { AxiosError, AxiosResponse } from 'axios'
import axiosErrorHandler from './helpers/axiosErrorHandler'
import LoginAuthenticationAdapter from '../adapters/authentication/loginAuthenticationAdapter'

class LoginController {

	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body
			LoginAuthenticationAdapter.login(email, password)
				.then((data: AxiosResponse) =>
					res
						.status(200)
						.header('auth-token', data.headers['auth-token'])
						.send()
				)
				.catch((err: AxiosError) => axiosErrorHandler(err, next))
		} catch (e) {
			next(e)
		}
	}
}

export const loginController: LoginController = new LoginController()
