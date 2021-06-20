import { VaccinationPeriod, VaccinationPeriodModel } from '../database/models/vaccination-period'
import { ReserveRequestDto } from '../dto/reserveRequestDto'
import { ReserveProcessDto } from '../dto/reserveProcessDto'

class ReserveService {
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

	public static async updateVaccinationPeriod(vaccinationPeriod: VaccinationPeriod) {
		const vaccinationPeriodModel = new VaccinationPeriodModel(vaccinationPeriod)
		vaccinationPeriodModel.amountOfVaccines = (vaccinationPeriod.amountOfVaccines ?? 1) - 1
		vaccinationPeriod.amountOfVaccines = vaccinationPeriodModel.amountOfVaccines
		return vaccinationPeriodModel.save()
	}

	private static async processReserveWithNoAvailablePeriod() {
		return new ReserveProcessDto({
			statusMessage: 'Reserve is saved a SMS will be sent with the details for the vaccination',
			success: false
		})
	}

	private static async processVaccinationCenter(vaccinationPeriod: VaccinationPeriod, requestModel: ReserveRequestDto) {
		await this.updateVaccinationPeriod(vaccinationPeriod)

		return new ReserveProcessDto({
			// @ts-ignore
			vaccinationCenterId: vaccinationPeriod.vaccinationCenterId,
			vaccinationDay: requestModel.attributes.reserveDate,
			statusMessage: 'Reserve made successfully',
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
			departmentId: requestModel.attributes.department,
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
