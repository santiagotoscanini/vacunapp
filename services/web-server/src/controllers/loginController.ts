import { Request, Response } from 'express';

import axios, { AxiosError, AxiosResponse } from 'axios';

class LoginController {

	public async login(req: Request, res: Response) {
		const login_host: string = process.env.LOGIN_HOST || 'login-service.com';
		const login_port: number = +(process.env.LOGIN_PORT || '3001');
		const login_url: string = `http://${login_host}:${login_port}`;

		const body = req.body;
		console.log(login_url);
		axios
			.post(`${login_url}/login`, body)
			.then((data: AxiosResponse) =>
				res
					.status(200)
					.header('auth-token', data.headers['auth-token'])
					.send()
			)
			.catch((err: AxiosError) => {
				console.error(err);
				res.send(err);
			});
	}
}

export const loginController: LoginController = new LoginController();
