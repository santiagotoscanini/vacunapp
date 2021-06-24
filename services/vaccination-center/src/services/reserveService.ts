import { VaccinationPeriod, VaccinationPeriodModel } from '../database/models/vaccination-period'
import { ReserveRequestDto } from '../dto/reserveRequestDto'
import { ReserveProcessDto } from '../dto/reserveProcessDto'
import { Reserve, ReserveModel } from '../database/models/reserve'
import { RequestError } from '../middlewares/errorHandler/RequestError'
import { User } from '../database/models/user'
import { SelectionCriteria } from '../database/models/selection-criteria/selectionCriteria'
import { Types } from 'mongoose'
import { UserModel } from '../database/models/user'
import { VaccinationCenterModel } from '../database/models/vaccination-center'
import { VaccinationRegisterDto } from '../dto/vaccinationRegisterDto'
import { VaccinationRegisterModel } from '../database/models/vaccination-register'
import UserService from '../services/userService'

class ReserveService {
	public static async deleteReserve(userId: string, reserveId: string) {
		const reserve = await this.getReserve(reserveId, userId)
		await this.deleteReserveUpdatePeriod(reserve)
		await UserService.deleteUser(userId)
	}

	public static async createReserve(
		user: User,
		reserveProcessDto: ReserveProcessDto,
		timeStampInit: number,
		reserveRequestDto: ReserveRequestDto
	) {
		const timeStampFinish = Date.now()
		const reserve = new ReserveModel({
			userId: user,
			userPriority: user.priority,
			userDateOfBirth: user.dateOfBirth,
			departmentId: reserveRequestDto.attributes.departmentId,
			departmentZone: reserveRequestDto.attributes.departmentZone,
			vaccinationCenterId: reserveProcessDto.attributes.vaccinationCenterId,
			vaccinationPeriodId: reserveProcessDto.attributes.vaccinationPeriodId,
			vaccinationDay: reserveRequestDto.attributes.reserveDate,
			statusMessage: reserveProcessDto.attributes.statusMessage,
			timeStampFinish: timeStampFinish,
			timeStampInit: timeStampInit,
			isProcessed: reserveProcessDto.attributes.success
		})
		await reserve.validate()
		return reserve
	}

	public static async processReserve(reserveRequestDto: ReserveRequestDto, user: User) {
		const vaccinationPeriods = await this.getVaccinationPeriods(reserveRequestDto, user)
		let vaccinationPeriod = this.filterVaccinationPeriodsWithTurn(reserveRequestDto, vaccinationPeriods)

		if (vaccinationPeriod) {
			return await this.processVaccinationCenter(vaccinationPeriod, reserveRequestDto)
		} else {
			if (vaccinationPeriods.length > 0) {
				return await this.processVaccinationCenter(vaccinationPeriods[0], reserveRequestDto)
			} else {
				return await this.processReserveWithNoAvailablePeriod()
			}
		}
	}

	public static async removeVaccineFromPeriod(vaccinationPeriod: VaccinationPeriod) {
		await this.updateVaccinationPeriod(vaccinationPeriod, (vaccinationPeriod.amountOfVaccines ?? 1) - 1)
	}

	public static async addVaccineFromPeriod(vaccinationPeriod: VaccinationPeriod) {
		await this.updateVaccinationPeriod(vaccinationPeriod, (vaccinationPeriod.amountOfVaccines ?? 0) + 1)
	}

	public static async addVaccinationRegister(vacRegister: VaccinationRegisterDto){
		const vacRegisterModel = new VaccinationRegisterModel(
			{
				departmentZone: vacRegister.attributes.departmentZone,
				departmentId: vacRegister.attributes.departmentId,
				age: vacRegister.attributes.age,
				vaccinationDay: vacRegister.attributes.vaccinationDay,
				workingTime: vacRegister.attributes.workingTime
			}
		)
		await vacRegisterModel.save()
	}

	public static async getReserve(reserveId: string, userId: string) {
		const reserve = await ReserveModel.findOne({ code: reserveId })
			.populate('userId')
			.populate('vaccinationCenterId')
			.exec()
		// @ts-ignore
		if (reserve == undefined || reserve.userId.id != userId) {
			throw new RequestError(`Reserva ${reserveId} para la Cédula de Identidad ${userId} no existe`, 400)
		}
		return reserve
	}

	public static async getUserReserve(userId: string) {
		const user = await UserModel.findOne({ id: userId })
		if (!user) {
			throw new RequestError(`No existe un usuario con CI ${userId}`, 404)
		}
		const mongoUserId = user._id
		const reserve = await ReserveModel.findOne({ userId: new Types.ObjectId(mongoUserId) })
		if (!reserve) {
			throw new RequestError(`No existe una reserva para la CI ${userId}`, 404)
		}
		return reserve
	}

	public static async getReserveVaccinationCenter(reserve: Reserve) {
		// @ts-ignore
		const vacPeriod = await VaccinationPeriodModel.findOne({ _id: new Types.ObjectId(reserve.vaccinationPeriodId) })
		if(!vacPeriod){
			throw new RequestError(`No existe un período de vacunación para la reserva ${reserve.code}`, 404)
		}
		// @ts-ignore
		const vacCenter = await VaccinationCenterModel.findOne({_id: new Types.ObjectId(vacPeriod.vaccinationCenterId)})
		if(!vacCenter){
			throw new RequestError(`No existe el Centro de vacuncación del período seleccionado`, 404)
		}
		return vacCenter
	}

	private static async deleteReserveUpdatePeriod(reserve: Reserve) {
		if (reserve.isProcessed) {
			// @ts-ignore
			await ReserveService.addVaccineFromPeriod(reserve.vaccinationPeriodId)
		}
		await ReserveModel.deleteOne({ code: reserve.code })
	}

	public static async validateAndUpdateReserveMessage(reserve: Reserve, message: string) {
		const reserveModel = new ReserveModel(reserve)
		reserveModel.statusMessage = message
		return reserveModel.save()
	}

	private static async updateVaccinationPeriod(vaccinationPeriod: VaccinationPeriod, amount: number) {
		const vaccinationPeriodModel = new VaccinationPeriodModel(vaccinationPeriod)
		vaccinationPeriodModel.amountOfVaccines = amount
		vaccinationPeriod.amountOfVaccines = amount
		return vaccinationPeriodModel.save()
	}

	private static async getVaccinationPeriods(reserveRequestDto: ReserveRequestDto, user: User) {
		const vaccinationPeriods = await VaccinationPeriodModel
			.find(this.filterVaccinationPeriods(reserveRequestDto))
			.populate('vaccinationCenterId')
			.populate('selectionCriteriaId')
			.exec()

		return vaccinationPeriods.filter((period: VaccinationPeriod) => {
			if (period?.selectionCriteriaId instanceof SelectionCriteria) {
				return period?.selectionCriteriaId.validateUser(user)
			} else {
				return true
			}
		})
	}

	private static async processReserveWithNoAvailablePeriod() {
		return new ReserveProcessDto({
			statusMessage: 'Reserva procesada correctamente, se enviara un SMS con los detalles',
			success: false
		})
	}

	private static async processVaccinationCenter(vaccinationPeriod: VaccinationPeriod, requestModel: ReserveRequestDto) {
		await this.removeVaccineFromPeriod(vaccinationPeriod)

		return new ReserveProcessDto({
			// @ts-ignore
			vaccinationCenterId: vaccinationPeriod.vaccinationCenterId,
			vaccinationPeriodId: vaccinationPeriod,
			vaccinationDay: requestModel.attributes.reserveDate,
			statusMessage: 'Reserva procesada correctamente',
			success: true
		})
	}

	private static filterVaccinationPeriodsWithTurn(
		requestModel: ReserveRequestDto,
		vaccinationPeriods: Array<VaccinationPeriod>
	) {
		// @ts-ignore
		return vaccinationPeriods.find((x) => x.vaccinationCenterId?.workingTime == requestModel.attributes.turn)
	}

	private static filterVaccinationPeriods(requestModel: ReserveRequestDto) {
		return {
			departmentZone: requestModel.attributes.departmentZone,
			departmentId: requestModel.attributes.departmentId,
			amountOfVaccines: {
				$gt: 0
			},
			dateFrom: {
				$lte: requestModel.attributes.reserveDate
			},
			dateTo: {
				$gte: requestModel.attributes.reserveDate
			}
		}
	}
}

export default ReserveService
