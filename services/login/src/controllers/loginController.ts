import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import db from '../database/models';
import { RequestError } from '../middlewares/errorHandler/RequestError';

class LoginController {
	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;

			const user = await db.User.findByPk(email);

			if (user && await user.validPassword(password)) {
				const tokenExpiration: number = 60 * 60 * 24; // 1 day

				const token = await jwt.sign(
					{ email: user.email, roles: user.roles },
					process.env.JWT_SECRET_KEY || 'dummy_token',
					{ expiresIn: tokenExpiration }
				);

				res.header('auth-token', token).json({ email });
			} else {
				throw new RequestError('bad credentials', 400);
			}
		} catch (e) {
			next(e);
		}
	}
}

export const loginController: LoginController = new LoginController();
