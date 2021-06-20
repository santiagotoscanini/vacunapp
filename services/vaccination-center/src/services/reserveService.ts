import { ReserveProcessModel } from '../models/ReserveProcessModel';
import { VaccinationPeriod, VaccinationPeriodModel } from '../database/models/vaccination-period';
import { ReserveRequestModel } from '../models/ReserveRequestModel';

class ReserveService {
	public static async createReserve(requestModel: ReserveRequestModel): Promise<ReserveProcessModel> {
		const vaccinationPeriods = await VaccinationPeriodModel
			.find(ReserveService.filterVaccinationPeriods(requestModel)).populate('vaccinationCenterId').exec();
		let vaccinationPeriod = ReserveService.filterVaccinationPeriodsWithTurn(requestModel, vaccinationPeriods);

		if (vaccinationPeriod) {
			return await this.processVaccinationCenter(vaccinationPeriod, requestModel);
		} else {
			if (vaccinationPeriods.length > 0) {

				return await this.processVaccinationCenter(vaccinationPeriods[0], requestModel);
			} else {
				//TODO: Revise non existent period and add to queue
				return new ReserveProcessModel({});
			}
		}
	}

	private static async processVaccinationCenter(vaccinationPeriod: VaccinationPeriod, requestModel: ReserveRequestModel) {
		await VaccinationPeriodModel.updateOne({ departmentId: vaccinationPeriod.departmentId },
			{ amountOfVaccines: vaccinationPeriod.amountOfVaccines ?? 1 - 1 });

		return new ReserveProcessModel({
			// @ts-ignore
			vaccinationCenterId: vaccinationPeriod.vaccinationCenterId,
			vaccinationDay: requestModel.attributes.reserveDate,
			statusMessage: 'Reserve made successfully'
		});
	}

	private static filterVaccinationPeriodsWithTurn(requestModel: ReserveRequestModel,
																									vaccinationPeriods: Array<VaccinationPeriod>) {
		// @ts-ignore
		return vaccinationPeriods.find((x) => x.vaccinationCenterId?.workingTime == requestModel.attributes.turn);
	}

	private static filterVaccinationPeriods(requestModel: ReserveRequestModel) {
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
		};
	}
}

export default ReserveService;
