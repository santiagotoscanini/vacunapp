import { NextFunction, Request, Response } from 'express'
import reserveSorting from '../services/queue/reserveSorting'

class ReserveController {
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const algorithmId = req.params.id
			reserveSorting.updateSortingAlgorithm(algorithmId)
			res.status(200).json({ message: 'Successfuly updated sorting algorithm' })
		} catch (e) {
			next(e)
		}
	}

	public async read(req: Request, res: Response, next: NextFunction) {
		try {
			res.status(200).json(Object.keys(reserveSorting.algorithmsDict))
		} catch (e) {
			next(e)
		}
	}
}

export default new ReserveController()
