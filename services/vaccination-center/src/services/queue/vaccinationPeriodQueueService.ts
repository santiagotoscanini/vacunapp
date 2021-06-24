import { ReserveModel } from '../../database/models/reserve'
import { VaccinationPeriod } from '../../database/models/vaccination-period'
import ReserveService from '../reserveService'
import reserveSorting from '../queue/reserveSorting'

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
		}).populate('userId')
			.sort(reserveSorting.getSortingAlgorithm())
			.limit(vaccinationPeriod.amountOfVaccines ?? 0)
			.cursor()
			.eachAsync(async function(reserve) {
				if (!reserve.isProcessed) {
					reserve.isProcessed = true
					reserve.vaccinationCenterId = vaccinationPeriod?.vaccinationCenterId
					reserve.statusMessage = 'Reserva registrada con exito'
					await reserve.save()
					await ReserveService.removeVaccineFromPeriod(vaccinationPeriod)
					// @ts-ignore
					ReserveService.sendMessage(reserve.userId, reserve)
				}
			})
	}
}

export default VaccinationPeriodQueueService
