import { NextFunction, Request, Response } from 'express'
import { VaccinationCenterModel } from '../database/models/vaccination-center'
import { RequestError } from '../middlewares/errorHandler/RequestError'
import VaccinationCenterService from '../services/vaccinationCenterService'
import ReserveService from '../services/reserveService'
import UserService from '../services/userService'
import { VaccinationRegisterDto } from '../dto/vaccinationRegisterDto'
import CiIdentificationAdapter from '../adapters/identification/ciIdentificationAdapter'
import moment from 'moment'
import isValidDate from './helpers/dateHelper'

class VaccinationCenterController {
	public static async getUserAge(userId: string): Promise<number> {
		const userInformation = await CiIdentificationAdapter.getInformation(userId)
		const dateOfBirthStr: Date = userInformation.dateOfBirth
		const dateOfBirth = moment(dateOfBirthStr, 'YYYY-MM-DD')

		return moment().diff(dateOfBirth, 'years', false)
	}

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

	public async getVaccines(req: Request, res: Response, next: NextFunction) {
		try {
			const { vaccinationCenterId, date } = req.query
			// @ts-ignore
			const parsedDate = new Date(date)

			if (!isValidDate(parsedDate)) {
				throw new RequestError(`Formato de fecha invalido:${date}`, 400)
			}
			// @ts-ignore
			res.status(200).json(await VaccinationCenterService.getVaccinesGiven(vaccinationCenterId, parsedDate))
		} catch (e) {
			next(e)
		}
	}

	public async getRemainingVaccines(req: Request, res: Response, next: NextFunction) {
		try {
			const pendingVaccines = await VaccinationCenterService.getPendingReserves()
			res.status(200).json(pendingVaccines)
		} catch (e) {
			next(e)
		}
	}

	public async vaccinate(req: Request, res: Response, next: NextFunction) {
		try {
			const { vaccinationCenterId, userId, vaccinationDate } = req.body
			const parsedDate = new Date(vaccinationDate)
			if (!isValidDate(parsedDate)) {
				throw new RequestError(`Formato de fecha invalido:${vaccinationDate}`, 400)
			}

			const reserve = await ReserveService.getUserReserve(userId)

			// @ts-ignore
			if (!moment(reserve.vaccinationDate).isSame(moment(parsedDate))) {
				throw new RequestError(`La fecha de vacunación no coincide con la de la reserva`, 400)
			}
			if (reserve.statusMessage == 'Vacunación completada') {
				throw new RequestError(`El usuario ${userId} ya ha sido vacunado`, 400)
			}

			const vacCenter = await ReserveService.getReserveVaccinationCenter(reserve)
			if (vacCenter.id != vaccinationCenterId) {
				throw new RequestError(`El centro de vacunación ${vaccinationCenterId} no coincide con el de la reserva`, 400)
			}

			await ReserveService.updateReserveMessage(reserve, 'Vacunación completada')

			// @ts-ignore
			const userIdentifier = await UserService.getUserIdentifier(reserve.userId)
			const userAge = await VaccinationCenterController.getUserAge(userIdentifier)

			let vacRegister = new VaccinationRegisterDto({
				departmentZone: reserve.departmentZone,
				departmentId: reserve.departmentId,
				vaccinationDate: parsedDate,
				age: userAge,
				workingTime: vacCenter.workingTime
			})
			await ReserveService.addVaccinationRegister(vacRegister)

			res.status(200).send({ 'message': 'Vacunación completada' })
		} catch (e) {
			next(e)
		}
	}
}

export default new VaccinationCenterController()
