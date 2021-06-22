import { NextFunction, Request, Response } from 'express'
import ReserveService from '../services/reserveService'
import { ReserveRequestDto } from '../dto/reserveRequestDto'
import { RequestError } from '../middlewares/errorHandler/RequestError'
import UserService from '../services/userService'

class ReserveController {
	private static getReserveRequestModel(body: { [index: string]: any }) {
		const { userId, phone, reserveDate, departmentId, departmentZone, turn } = body
		const reserveRequest = new ReserveRequestDto({
			// Month minus one, mongoose issue https://stackoverflow.com/questions/37388552/mongoose-increment-the-date-field-of-a-mongo-collection-by-one-month
			reserveDate: new Date(reserveDate['year'], reserveDate['month'] - 1, reserveDate['day']),
			departmentId: departmentId,
			departmentZone: departmentZone,
			turn: turn,
			userId: userId,
			phone: phone
		})

		return reserveRequest
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

	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const reserveRequestDto = ReserveController.getReserveRequestModel(req.body)
			let user = await UserService.getUser(reserveRequestDto.attributes.userId)

			if (user) throw new RequestError(`Ya existe una reserva para el usuario:${user.id}`, 400)

			const timeStampInit = Date.now()
			user = await UserService.createUser(reserveRequestDto)
			const reserveProcessDto = await ReserveService.processReserve(reserveRequestDto)
			const reserve = await ReserveService.createReserve(user, reserveProcessDto, timeStampInit, reserveRequestDto)

			await user.save()
			await reserve.save()

			res.status(200).json(reserve.toJson)
		} catch (e) {
			next(e)
		}
	}
}

export default new ReserveController()
