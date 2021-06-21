import { VaccinationPeriod, VaccinationPeriodModel } from '../database/models/vaccination-period'
import { ReserveRequestDto } from '../dto/reserveRequestDto'
import { ReserveProcessDto } from '../dto/reserveProcessDto'
import { Reserve, ReserveModel } from '../database/models/reserve'
import { RequestError } from '../middlewares/errorHandler/RequestError'

class ReserveService {
	public static async deleteReserve(userId: string, reserveId: string) {
		const reserve = await this.getReserve(reserveId, userId)
		await this.deleteReserveUpdatePeriod(reserve)
	}

	public static async createReserve(reserveRequestDto: ReserveRequestDto) {
		const vaccinationPeriods = await VaccinationPeriodModel
			.find(this.filterVaccinationPeriods(reserveRequestDto)).populate('vaccinationCenterId').exec()
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

	private static async deleteReserveUpdatePeriod(reserve: Reserve) {
		if (reserve.isProcessed) {
			// @ts-ignore
			await ReserveService.addVaccineFromPeriod(reserve.vaccinationPeriodId)
		}
		await ReserveModel.deleteOne({ code: reserve.code })
	}

	private static async updateVaccinationPeriod(vaccinationPeriod: VaccinationPeriod, amount: number) {
		const vaccinationPeriodModel = new VaccinationPeriodModel(vaccinationPeriod)
		vaccinationPeriodModel.amountOfVaccines = amount
		vaccinationPeriod.amountOfVaccines = amount
		return vaccinationPeriodModel.save()
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
