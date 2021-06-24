import { NextFunction, Request, Response } from 'express'
import { RequestError } from './RequestError'
import { JsonWebTokenError } from 'jsonwebtoken'

export default async (err: Error, req: Request, res: Response, next: NextFunction) => {
	let message: string
	let status: number

	switch (true) {
		case err instanceof RequestError:
			status = (err as RequestError).status
			message = err.message
			break
		case err instanceof JsonWebTokenError:
			status = 400
			message = err.message || 'Error with Auth Token'
			break
		default:
			status = 500
			message = 'Unknown Error'
	}
	return res.status(status).json({ 'message': message })
}
