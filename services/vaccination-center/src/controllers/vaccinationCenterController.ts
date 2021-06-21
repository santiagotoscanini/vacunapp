import { NextFunction, Request, Response } from 'express'
import { VaccinationCenterModel } from '../database/models/vaccination-center'
import { RequestError } from '../middlewares/errorHandler/RequestError'

class VaccinationCenterController {
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, name, workingTime, departmentId, departmentZone } = req.body

			let vaccinationCenter = await VaccinationCenterModel.findOne({ id: id })

			if (vaccinationCenter) throw new RequestError(`Ya existe un vacunatorio para el id:${id}`, 400)
			vaccinationCenter = new VaccinationCenterModel({
				id: id,
				name: name,
				workingTime: workingTime,
				departmentId: departmentId,
				departmentZone: departmentZone
			})

			await vaccinationCenter.save()

			res.status(200).json(vaccinationCenter)
		} catch (e) {
			next(e)
		}
	}
}

export default new VaccinationCenterController()
