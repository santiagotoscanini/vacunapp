import { VaccinationPeriod } from '../database/models/vaccination-period'
import { ReserveModel } from '../database/models/reserve'
import ReserveService from './reserveService'

class VaccinationPeriodQueueService {
	public static async processVaccinationPeriod(vaccinationPeriod: VaccinationPeriod) {
		await ReserveModel.find({
			departmentId: vaccinationPeriod.departmentId,
			departmentZone: vaccinationPeriod.departmentZone,
			vaccinationDay: {
				$gte: vaccinationPeriod.dateFrom,
				$lte: vaccinationPeriod.dateTo
			},
			isProcessed: false
		}).limit(vaccinationPeriod.amountOfVaccines ?? 0)
			.cursor()
			.eachAsync(async function(reserve) {
				if (!reserve.isProcessed) {
					reserve.isProcessed = true
					reserve.vaccinationCenterId = vaccinationPeriod?.vaccinationCenterId
					reserve.statusMessage = 'Reserva registrada con exito'
					await reserve.save()

					await ReserveService.removeVaccineFromPeriod(vaccinationPeriod)
				}
			})
	}
}

export default VaccinationPeriodQueueService
