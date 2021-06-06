import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');

function validateAdminRol(roles: String): Boolean {
	return roles.toLowerCase().includes('admin');
}

export default async (req: Request, res: Response, next: NextFunction) => {
	const authHeader: string | undefined = req.header('authorization');

	let token;
	if (authHeader) {
		// This is to remove the 'Bearer' text from token.
		token = authHeader.split(' ')[1];
	} else {
		return res
			.status(401)
			.json({ 'message': 'missing authentication' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

		if (validateAdminRol(decoded['roles'])) {
			next();
		} else {
			return res.status(403).json({ 'message': 'missing authorization' });
		}
	} catch (e) {
		return res.status(401).json({ 'message': 'invalid token' });
	}
};
