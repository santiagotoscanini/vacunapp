import { NextFunction, Request, Response } from 'express'
import VaccinationRegisterService from '../services/vaccinationRegisterService'
import moment from 'moment'

class AppliedVaccinesController {
	public async getCountOfAppliedVaccinesByDateRange(req: Request, res: Response, next: NextFunction) {
		try {
			const requestTimeStamp = new Date()
			const { dateFrom, dateTo } = req.body
			const appliedVaccines = await VaccinationRegisterService.getAppliedVaccinesByDateRange(
				moment(dateFrom, 'DD/MM/YYYY').toDate(),
				moment(dateTo, 'DD/MM/YYYY').toDate()
			)
			const responseTimeStamp = new Date()
			const processTimeStamp = responseTimeStamp.getTime() - requestTimeStamp.getTime()

			res.status(200).json({
				'queryRequestTimeStamp': requestTimeStamp,
				'queryResponseTimeStamp': responseTimeStamp,
				'queryProcessingTimeStampInMS': processTimeStamp,
				'appliedVaccines': appliedVaccines
			})
		} catch (e) {
			next(e)
		}
	}

	public async getCountOfAppliedVaccinesByDateAndAgeRange(req: Request, res: Response, next: NextFunction) {
		try {
			const requestTimeStamp = new Date()
			const { dateFrom, dateTo, ageFrom, ageTo } = req.body
			const appliedVaccines = await VaccinationRegisterService.getAppliedVaccinesByDateAndAgeRange(
				moment(dateFrom, 'DD/MM/YYYY').toDate(),
				moment(dateTo, 'DD/MM/YYYY').toDate(),
				ageFrom,
				ageTo
			)
			const responseTimeStamp = new Date()
			const processTimeStamp = responseTimeStamp.getTime() - requestTimeStamp.getTime()

			res.status(200).json({
				'queryRequestTimeStamp': requestTimeStamp,
				'queryResponseTimeStamp': responseTimeStamp,
				'queryProcessingTimeStampInMS': processTimeStamp,
				'appliedVaccines': appliedVaccines
			})
		} catch (e) {
			next(e)
		}
	}
}

export default new AppliedVaccinesController()
