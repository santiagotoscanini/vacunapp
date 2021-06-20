import { VaccinationCenterModel } from '../models/vaccination-center';
import { SelectionCriteriaModel } from '../models/selection-criteria/selectionCriteria';
import { VaccinationPeriodModel } from '../models/vaccination-period';
import { Types } from 'mongoose';

class SeedMongoDb {
	constructor() {
		// ObjectId Format https://www.tutorialspoint.com/mongodb/mongodb_objectid.htm
		const vaccinationCenterId = new Types.ObjectId('5349b4ddd2781d08c09890f3');

		VaccinationCenterModel.exists({ '_id': vaccinationCenterId }).then(exists => {
				console.log('Seeding...');
				if (!exists) {
					console.log('Seed not detected, inserting data...');
					SeedMongoDb.createVaccinationCenter(vaccinationCenterId);
					const selectionCriteriaIds = [
						new Types.ObjectId('5349b4ddd2781d08c09890f2'),
						new Types.ObjectId('5349b4ddd2781d08c09890f1')
					];
					SeedMongoDb.createSelectionCriteria(selectionCriteriaIds);
					SeedMongoDb.createVaccinationPeriod(vaccinationCenterId, selectionCriteriaIds);
				} else {
					console.log('Seed already detected...');
				}
			}
		);
	}

	private static async createVaccinationCenter(vaccinationCenterId: Types.ObjectId) {
		await VaccinationCenterModel.create({
			'_id': vaccinationCenterId,
			'__v': 0,
			'id': 'antel_arena2',
			'workingTime': 1,
			'name': 'Antel Arena',
			'departmentZone': 12,
			'department': 3
		});
	}

	private static async createSelectionCriteria(selectionCriteriaIds: Types.ObjectId[]) {
		const selectionCriteria = await SelectionCriteriaModel.insertMany(
			[
				{
					'_id': selectionCriteriaIds[0],
					'__t': 'AgeSelectionCriteria',
					'__v': 0,
					'criteria': 'age',
					'from': 18,
					'to': 30
				},
				{
					'_id': selectionCriteriaIds[1],
					'__t': 'PriorityGroupSelectionCriteria',
					'__v': 0,
					'criteria': 'priorityGroup',
					'group': 1
				}
			]);
		return selectionCriteria.map(sc => sc._id);
	}

	private static async createVaccinationPeriod(vaccinationCenterId: any, selectionCriteriaIds: any) {
		await VaccinationPeriodModel.insertMany([{
			'__v': 0,
			'amountOfVaccines': 2,
			'dateFrom': new Date(2021, 3, 3),
			'dateTo': new Date(2021, 3, 1),
			'departmentId': 1,
			'departmentZone': 4,
			'selectionCriteriaId': selectionCriteriaIds[0],
			'vaccinationCenterId': vaccinationCenterId
		}, {
			'__v': 0,
			'amountOfVaccines': 3,
			'dateFrom': new Date(2021, 3, 3),
			'dateTo': new Date(2021, 12, 1),
			'departmentId': 1,
			'departmentZone': 4,
			'selectionCriteriaId': selectionCriteriaIds[1],
			'vaccinationCenterId': vaccinationCenterId
		}]);
	}
}

export default SeedMongoDb;