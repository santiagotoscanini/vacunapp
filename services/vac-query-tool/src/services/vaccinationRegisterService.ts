import { VaccinationRegisterModel } from '../database/models/vaccination-register'

class VaccinationRegisterService {
	public static async getAppliedVaccinesByDateRange(dateFrom: Date, dateTo: Date) {
		const vaccinationRegisters = await VaccinationRegisterModel.aggregate([
			{
				$match: {
					'vaccinationDate': {
						$gte: dateFrom,
						$lte: dateTo
					}
				}
			},
			{
				$group: {
					'_id': {
						'departmentId': '$departmentId',
						'workingTime': '$workingTime'
					},
					'amountOfAppliedVaccines': {
						$sum: 1
					}
				}
			}
		])
		if (vaccinationRegisters.length == 0) {
			return `No se realizaron vacunaciones entre las fechas ${dateFrom} - ${dateTo}`
		}
		return vaccinationRegisters
	}

	public static async getAppliedVaccinesByDateAndAgeRange(dateFrom: Date, dateTo: Date, ageFrom: number, ageTo: number) {
		const vaccinationRegisters = await VaccinationRegisterModel.aggregate([
			{
				$match: {
					'vaccinationDate': {
						$gte: dateFrom,
						$lte: dateTo
					},
					'age': {
						$gte: ageFrom,
						$lte: ageTo
					}
				}
			},
			{
				$group: {
					'_id': {
						'departmentId': '$departmentId',
						'departmentZone': '$departmentZone'
					},
					'amountOfAppliedVaccines': {
						$sum: 1
					}
				}
			}
		])
		if (vaccinationRegisters.length == 0) {
			return `No se realizaron vacunaciones entre las fechas ${dateFrom} - ${dateTo} a usuarios con edades entre ${ageFrom} - ${ageTo}`
		}
		return vaccinationRegisters
	}
}

export default VaccinationRegisterService
