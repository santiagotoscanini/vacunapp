import { NextFunction, Request, Response } from 'express'
import PendingReservesService from '../services/pendingReservesService'

class PendingReservesController {
	public async getPendingReservesByDepartment(req: Request, res: Response, next: NextFunction) {
		try {
			const requestTimeStamp = new Date()
			const pendingReserves = await PendingReservesService.getPendingReservesByDepartment()
			const responseTimeStamp = new Date()
			const processTimeStamp = responseTimeStamp.getTime() - requestTimeStamp.getTime()

			res.status(200).json({
				'queryRequestTimeStamp': requestTimeStamp,
				'queryResponseTimeStamp': responseTimeStamp,
				'queryProcessingTimeStampInMS': processTimeStamp,
				'response': pendingReserves
			})
		} catch (e) {
			next(e)
		}
	}
}

export default new PendingReservesController()
