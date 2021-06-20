import { NextFunction, Request, Response } from 'express';
import { RequestError } from './RequestError';

export default async (err: Error, req: Request, res: Response, next: NextFunction) => {
	let message = '';
	let status = 0;

	switch (true) {
		case err instanceof RequestError:
			status = (err as RequestError).status;
			message = err.message;
			break;
		default:
			status = 500;
			message = 'Unknown Error';
	}
	return res.status(status).json({ 'message': message });
}
