import { NextFunction, Request, Response } from 'express'
import { VaccinationCenterModel } from '../database/models/vaccination-center'
import { RequestError } from '../middlewares/errorHandler/RequestError'
import ReserveService from '../services/reserveService'
import UserService from '../services/userService'
import { VaccinationRegisterDto } from '../dto/vaccinationRegisterDto'
import CiIdentificationAdapter from '../adapters/identification/ciIdentificationAdapter'
import moment from 'moment'

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

	public async vaccinate(req: Request, res: Response, next: NextFunction) {
		try {
			const { vaccinationCenterId, userId, vaccinationDate } = req.body

			const reserve = await ReserveService.getUserReserve(userId)

			// @ts-ignore
			if (!moment(reserve.vaccinationDay).isSame(moment(vaccinationDate, 'DD-MM-YYYY'))) {
				throw new RequestError(`La fecha de vacunación no coincide con la de la reserva`, 400)
			}

			const vacCenter = await ReserveService.getReserveVaccinationCenter(reserve)
			if (vacCenter.id != vaccinationCenterId) {
				throw new RequestError(`El centro de vacunación ${vaccinationCenterId} no coincide con el de la reserva`, 400)
			}

			if(reserve.statusMessage == 'Vacunación completada'){
				throw new RequestError(`El usuario ${userId} ya ha sido vacunado`, 400)
			}
			await ReserveService.validateAndUpdateReserveMessage(reserve, 'Vacunación completada')

			// @ts-ignore
			const userIdentifier = await UserService.getUserIdentifier(reserve.userId)
			const userAge = await VaccinationCenterController.getUserAge(userIdentifier)

			let vacRegister = new VaccinationRegisterDto({
				departmentZone: reserve.departmentZone,
				departmentId: reserve.departmentId,
				vaccinationDay: moment(vaccinationDate, 'DD/MM/YYYY').toDate(),
				age: userAge,
				workingTime: vacCenter.workingTime
			})
			await ReserveService.addVaccinationRegister(vacRegister)

			res.status(200).send({ 'message': 'Vacunación completada' })
		} catch (e) {
			next(e)
		}
	}

	public static async getUserAge(userId: string): Promise<number> {
		const userInformation = await CiIdentificationAdapter.getInformation(userId)
		const dateOfBirthStr: Date = userInformation.data['dateOfBirth']
		const dateOfBirth = moment(dateOfBirthStr, 'YYYY-MM-DD')

		return moment().diff(dateOfBirth, 'years', false)
	}
}

export default new VaccinationCenterController()
