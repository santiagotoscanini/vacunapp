import { NextFunction, Request, Response } from 'express'
import reserveSorting from '../services/queue/reserveSorting'
import apiConfigService from '../services/apiConfigService'

class ConfigController {
	public async changeAlgorithm(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.body.id
			await reserveSorting.updateSortingAlgorithm(id)
			res.status(200).json({ message: 'Algoritmo actualizado correctamente' })
		} catch (e) {
			next(e)
		}
	}

	public async fetchAlgorithms(req: Request, res: Response, next: NextFunction) {
		try {
			res.status(200).json(Object.keys(reserveSorting.algorithmsDict))
		} catch (e) {
			next(e)
		}
	}

	public async changeSmsUrl(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.body.id
			await apiConfigService.updateSmsUrl(id)
			res.status(200).json({ message: 'URL de SMS actualizada' })
		} catch (e) {
			next(e)
		}
	}

	public async changeIdProviderUrl(req: Request, res: Response, next: NextFunction) {
		try {
			const id = req.body.id
			await apiConfigService.updateIdProviderUrl(id)
			res.status(200).json({ message: 'URL de Provedor de Identificacion actualizada' })
		} catch (e) {
			next(e)
		}
	}
}

export default new ConfigController()
