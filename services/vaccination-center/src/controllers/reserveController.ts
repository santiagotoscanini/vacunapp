import { NextFunction, Request, Response } from 'express'
import { User, UserModel } from '../database/models/user'
import { Reserve, ReserveModel } from '../database/models/reserve'
import ReserveService from '../services/reserveService'
import { ReserveProcessDto } from '../dto/reserveProcessDto'
import { ReserveRequestDto } from '../dto/reserveRequestDto'
import { RequestError } from '../middlewares/errorHandler/RequestError'

class ReserveController {
	private static async saveUser(reserveRequestDto: ReserveRequestDto) {
		const user = new UserModel({
			id: reserveRequestDto.attributes.userId,
			phone: reserveRequestDto.attributes.phone
		})
		await user.save()

		return user
	}

	private static async getUser(userId: string) {
		return UserModel.findOne({ id: userId })
	}

	private static getReserveRequestModel(body: { [index: string]: any }) {
		const { userId, phone, reserveDate, departmentId, departmentZone, turn } = body

		return new ReserveRequestDto({
			// Month minus one, mongoose issue https://stackoverflow.com/questions/37388552/mongoose-increment-the-date-field-of-a-mongo-collection-by-one-month
			reserveDate: new Date(reserveDate['year'], reserveDate['month'] - 1, reserveDate['day']),
			departmentId: departmentId,
			departmentZone: departmentZone,
			turn: turn,
			userId: userId,
			phone: phone
		})
	}

	private static async saveReserve(
		user: User,
		reserveProcessDto: ReserveProcessDto,
		timeStampInit: number,
		reserveRequestDto: ReserveRequestDto
	) {
		const timeStampFinish = Date.now()
		const reserve = new ReserveModel({
			userId: user,
			departmentId: reserveRequestDto.attributes.departmentId,
			departmentZone: reserveRequestDto.attributes.departmentZone,
			vaccinationCenterId: reserveProcessDto.attributes.vaccinationCenterId,
			vaccinationPeriodId: reserveProcessDto.attributes.vaccinationPeriodId,
			vaccinationDay: reserveProcessDto.attributes.vaccinationDay ?? reserveRequestDto.attributes.reserveDate,
			statusMessage: reserveProcessDto.attributes.statusMessage,
			timeStampFinish: timeStampFinish,
			timeStampInit: timeStampInit,
			isProcessed: reserveProcessDto.attributes.success
		})
		return reserve.save()
	}

	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const reserveRequestDto = ReserveController.getReserveRequestModel(req.body)
			let user = await ReserveController.getUser(reserveRequestDto.attributes.userId)

			if (user) throw new RequestError(`Ya existe una reserva para el usuario:${user.id}`, 400)

			const timeStampInit = Date.now()
			user = await ReserveController.saveUser(reserveRequestDto)

			const reserveProcessDto = await ReserveService.createReserve(reserveRequestDto)
			const reserve: Reserve = await ReserveController.saveReserve(user, reserveProcessDto, timeStampInit, reserveRequestDto)

			res.status(200).json(reserve.toJson)
		} catch (e) {
			next(e)
		}
	}

	public async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, reserveId } = req.body
			await ReserveService.deleteReserve(userId, reserveId)
			res.status(200).json(`Reserva ${reserveId} para la Cédula de Identidad ${userId} ha sido cancelada`)
		} catch (e) {
			next(e)
		}
	}

	public async read(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, reserveId } = req.body
			const reserve = await ReserveService.getReserve(reserveId, userId)
			res.status(200).json(reserve.toJson)
		} catch (e) {
			next(e)
		}
	}
}

export default new ReserveController()
