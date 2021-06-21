import { VaccinationCenterModel } from '../models/vaccination-center'
import { SelectionCriteriaModel } from '../models/selection-criteria/selectionCriteria'
import { VaccinationPeriodModel } from '../models/vaccination-period'
import { Types } from 'mongoose'
import { generateReserveCode, ReserveModel } from '../models/reserve'
import { UserModel } from '../models/user'

class SeedMongoDb {
	constructor() {
		// ObjectId Format https://www.tutorialspoint.com/mongodb/mongodb_objectid.htm
		const vaccinationCenterId = new Types.ObjectId('5349b4ddd2781d08c09890f3')

		VaccinationCenterModel.exists({ '_id': vaccinationCenterId }).then(exists => {
				console.log('Seeding...')
				if (!exists) {
					console.log('Seed not detected, inserting data...')
					SeedMongoDb.createVaccinationCenter(vaccinationCenterId)
					const selectionCriteriaIds = [
						new Types.ObjectId('5349b4ddd2781d08c09890f2'),
						new Types.ObjectId('5349b4ddd2781d08c09890f1')
					]
					const vaccinationPeriodIds = [
						new Types.ObjectId('5349b4ddd2781d08c09890f4'),
						new Types.ObjectId('5349b4ddd2781d08c09890f5')
					]
					const userIds = [
						new Types.ObjectId('5349b4ddd2781d08c09890f6'),
						new Types.ObjectId('5349b4ddd2781d08c09890f7')
					]
					SeedMongoDb.createSelectionCriteria(selectionCriteriaIds)
					SeedMongoDb.createVaccinationPeriod(vaccinationCenterId, selectionCriteriaIds, vaccinationPeriodIds)
					SeedMongoDb.createReserves(vaccinationCenterId, userIds, vaccinationPeriodIds)
				} else {
					console.log('Seed already detected...')
				}
			}
		)
	}

	private static async createVaccinationCenter(vaccinationCenterId: Types.ObjectId) {
		await VaccinationCenterModel.create({
			'_id': vaccinationCenterId,
			'__v': 0,
			'id': 'antel_arena2',
			'workingTime': 1,
			'name': 'Antel Arena',
			'departmentZone': 12,
			'departmentId': 3
		})
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
			])
		return selectionCriteria.map(sc => sc._id)
	}

	private static async createVaccinationPeriod(vaccinationCenterId: any, selectionCriteriaIds: any, vaccinationPeriodIds: any) {
		await VaccinationPeriodModel.insertMany([{
			'__v': 0,
			'_id': vaccinationPeriodIds[0],
			'amountOfVaccines': 2,
			'dateFrom': new Date(2021, 3, 3),
			'dateTo': new Date(2021, 3, 1),
			'departmentZone': 12,
			'departmentId': 3,
			'selectionCriteriaId': selectionCriteriaIds[0],
			'vaccinationCenterId': vaccinationCenterId
		}, {
			'__v': 0,
			'_id': vaccinationPeriodIds[1],
			'amountOfVaccines': 3,
			'dateFrom': new Date(2021, 3, 3),
			'dateTo': new Date(2021, 12, 1),
			'departmentZone': 12,
			'departmentId': 3,
			'selectionCriteriaId': selectionCriteriaIds[1],
			'vaccinationCenterId': vaccinationCenterId
		}])
	}

	private static async createReserves(vaccinationCenterId: any, userIds: any, vaccinationPeriodIds: any) {
		await UserModel.insertMany([
			{
				'__v': 0,
				'_id': userIds[0],
				'id': 55569291,
				'phone': '098567345'
			},
			{
				'__v': 0,
				'_id': userIds[1],
				'id': 55138691,
				'phone': '098903345'
			}
		])
		await ReserveModel.insertMany([{
			'__v': 0,
			'code': generateReserveCode(),
			'userId': userIds[0],
			'departmentZone': 12,
			'departmentId': 3,
			'vaccinationDay': new Date(2021, 3, 27),
			'isProcessed': true,
			'vaccinationPeriodId': vaccinationPeriodIds[0],
			'vaccinationCenterId': vaccinationCenterId[0],
			'statusMessage': 'Reserva procesada correctamente',
			'timeStampInit': Date.now(),
			'timeStampFinish': Date.now()
		}, {
			'__v': 0,
			'code': generateReserveCode(),
			'userId': userIds[1],
			'departmentZone': 12,
			'departmentId': 3,
			'vaccinationDay': new Date(2021, 3, 27),
			'isProcessed': true,
			'vaccinationPeriodId': vaccinationPeriodIds[0],
			'vaccinationCenterId': vaccinationCenterId[0],
			'statusMessage': 'Reserva procesada correctamente',
			'timeStampInit': Date.now(),
			'timeStampFinish': Date.now()
		}])
	}
}

export default SeedMongoDb