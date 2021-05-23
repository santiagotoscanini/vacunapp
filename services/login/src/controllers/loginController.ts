import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import db from '../database/models';

class LoginController {
	public async login(req: Request, res: Response) {
		const { email, password } = req.body;

		const user = await db.User.findByPk(email);

		if (user && await user.validPassword(password)) {
			const tokenExpiration: number = 60 * 60 * 24; // 1 day

			const token: string = jwt.sign(
				{ email },
				process.env.JWT_SECRET_KEY || 'dummy_token',
				{ expiresIn: tokenExpiration }
			);

			res.header('auth-token', token).json({ email });
		} else {
			res.status(400).json({ 'message': 'bad credentials' });
		}
	}
}

export const loginController: LoginController = new LoginController();
