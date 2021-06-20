import { NextFunction, Request, Response } from 'express'
import { User, UserModel } from '../database/models/user'
import { ReserveModel } from '../database/models/reserve'
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
		const { userId, phone, reserveDate, department, departmentZone, turn } = body

		return new ReserveRequestDto({
			// Month minus one, mongoose issue https://stackoverflow.com/questions/37388552/mongoose-increment-the-date-field-of-a-mongo-collection-by-one-month
			reserveDate: new Date(reserveDate['year'], reserveDate['month'] - 1, reserveDate['day']),
			department: department,
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
			department: reserveRequestDto.attributes.department,
			departmentZone: reserveRequestDto.attributes.departmentZone,
			vaccinationCenterId: reserveProcessDto.attributes.vaccinationCenterId,
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

			if (user) throw new RequestError('This user is already registered to vaccinate', 400)

			const timeStampInit = Date.now()
			user = await ReserveController.saveUser(reserveRequestDto)

			const reserveProcessDto = await ReserveService.createReserve(reserveRequestDto)
			const reserve = await ReserveController.saveReserve(user, reserveProcessDto, timeStampInit, reserveRequestDto)

			res.status(200).json(reserve)
		} catch (e) {
			next(e)
		}
	}
}

export default new ReserveController()
