import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');

function validateRoles(roles: String): Boolean {
	// We only check for admin
	return roles.toLowerCase().includes('admin');
}

exports.authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.header('authorization');
	// This is to remove the 'Bearer' text from token.
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		return res.status(401).json({ 'message': 'missing authentication' });
	}


	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

		if (validateRoles(decoded['roles'])) {
			next();
		} else {
			return res.status(403).json({ 'message': 'missing authorization' });
		}
	} catch (e) {
		return res.status(401).json({ 'message': 'invalid token' });
	}
};
