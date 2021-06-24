import { ReserveModel } from '../database/models/reserve'
import { VaccinationCenterModel } from '../database/models/vaccination-center'
import { RequestError } from '../middlewares/errorHandler/RequestError'
import { VaccinationPeriodModel } from '../database/models/vaccination-period'
import { VaccinesGivenVaccinationCenterDto } from '../dto/vaccinesGivenVaccinationCenterDto'

class VaccinationCenterService {
	public static async getPendingReserves() {
		const pendingReserves = await ReserveModel.aggregate([
			{
				$match: {
					'isProcessed': false
				}
			}, {
				$group: {
					'_id': {
						'departmentId': '$departmentId',
						'departmentZone': '$departmentZone'
					},
					'reserves': {
						$addToSet: {
							'id': '$code'
						}
					}
				}
			}
		])
		if (pendingReserves.length == 0) {
			return `No hay reservas pendientes`
		}
		return pendingReserves
	}

	public static async getVaccinesGiven(vaccinationCenterId: string, date: Date) {
		const vaccinationCenter = await VaccinationCenterModel.findOne({ id: vaccinationCenterId })

		if (vaccinationCenter) {
			const vaccinationsGiven = await ReserveModel.count({
				vaccinationDate: {
					$gte: date
				},
				vaccinationCenterId: vaccinationCenter._id,
				statusMessage: 'Vacunación completada'
			})
			const vaccinationsRemaining = await VaccinationPeriodModel.count({
				vaccinationCenterId: vaccinationCenter._id,
				dateFrom: {
					$gte: date
				}
			})
			return new VaccinesGivenVaccinationCenterDto({
				vaccinesGiven: vaccinationsGiven,
				vaccinesRemaining: vaccinationsRemaining
			})
		}
		throw new RequestError(`No existe vacunatorio:${vaccinationCenterId}`, 400)
	}
}

export default VaccinationCenterService
