import { VaccinationCenterModel } from '../models/vaccination-center'
import { SelectionCriteriaModel } from '../models/selection-criteria/selectionCriteria'
import { VaccinationPeriodModel } from '../models/vaccination-period'
import { Types } from 'mongoose'
import { generateReserveCode, ReserveModel } from '../models/reserve'
import { UserModel } from '../models/user'
import { configIds, ConfigModel } from '../models/config'
import reserveSorting from '../../services/queue/reserveSorting'

class SeedMongoDb {
	constructor() {
		// ObjectId Format https://www.tutorialspoint.com/mongodb/mongodb_objectid.htm
		const vaccinationCenterId = new Types.ObjectId('5349b4ddd2781d08c09890f3')

		VaccinationCenterModel.exists({ '_id': vaccinationCenterId }).then(async exists => {
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
					const reserveIds = [
						new Types.ObjectId('5349b4ddd2781d08c09890f8'),
						new Types.ObjectId('5349b4ddd2781d08c09890f9')
					]
					const configIds = [
						new Types.ObjectId('5349b4ddd2781d08c09890d1'),
						new Types.ObjectId('5349b4ddd2781d08c09890d2'),
						new Types.ObjectId('5349b4ddd2781d08c09890d3')
					]
					await SeedMongoDb.createSelectionCriteria(selectionCriteriaIds)
					await SeedMongoDb.createVaccinationPeriod(vaccinationCenterId, selectionCriteriaIds, vaccinationPeriodIds)
					await SeedMongoDb.createReserves(vaccinationCenterId, userIds, vaccinationPeriodIds, reserveIds)
					await SeedMongoDb.loadConfigData(configIds)
				} else {
					console.log('Seed already detected...')
				}
			}
		)
	}

	private static async loadConfigData(mongoConfigIds: any) {
		await ConfigModel.create({
			'_id': mongoConfigIds[0],
			'__v': 0,
			id: configIds.currentSortingAlgorithm,
			data: Object.keys(reserveSorting.algorithmsDict)[0]
		})
		await ConfigModel.create({
			'_id': mongoConfigIds[1],
			'__v': 0,
			id: configIds.idProviderUrl,
			data: `http://${process.env.ID_PROVIDER_MOCK_HOST}`
		})
		await ConfigModel.create({
			'_id': mongoConfigIds[2],
			'__v': 0,
			id: configIds.smsUrl,
			data: `http://${process.env.SMS_MOCK_HOST}`
		})
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
			'dateFrom': new Date(2022, 3, 3),
			'dateTo': new Date(2022, 3, 1),
			'departmentZone': 12,
			'departmentId': 3,
			'selectionCriteriaId': selectionCriteriaIds[0],
			'vaccinationCenterId': vaccinationCenterId
		}, {
			'__v': 0,
			'_id': vaccinationPeriodIds[1],
			'amountOfVaccines': 3,
			'dateFrom': new Date(2022, 3, 3),
			'dateTo': new Date(2022, 12, 1),
			'departmentZone': 12,
			'departmentId': 3,
			'selectionCriteriaId': selectionCriteriaIds[1],
			'vaccinationCenterId': vaccinationCenterId
		}])
	}

	private static async createReserves(vaccinationCenterId: any, userIds: any, vaccinationPeriodIds: any, reserveIds: any) {
		await UserModel.insertMany([
			{
				'__v': 0,
				'_id': userIds[0],
				'id': '10000105',
				'phone': '098519534',
				'name': 'Cathlene',
				'surname': 'Rushmare',
				'secondSurname': 'Hastelow',
				'dateOfBirth': '11/24/1996',
				'priority': 4
			}, {
				'__v': 0,
				'_id': userIds[1],
				'id': '10000246',
				'phone': '098419534',
				'name': 'Farica',
				'surname': 'Gilhoolie',
				'secondSurname': 'Perryman',
				'dateOfBirth': '01/15/1988',
				'priority': 4
			}
		])
		await ReserveModel.insertMany([{
			'__v': 0,
			'_id': reserveIds[0],
			'code': generateReserveCode(),
			'userId': userIds[0],
			'departmentZone': 12,
			'departmentId': 3,
			'vaccinationDate': new Date(2022, 3, 27),
			'isProcessed': true,
			'vaccinationPeriodId': vaccinationPeriodIds[0],
			'vaccinationCenterId': vaccinationCenterId[0],
			'statusMessage': 'Reserva procesada correctamente',
			'timeStampInit': Date.now(),
			'timeStampFinish': Date.now(),
			'userPriority': 4,
			'userDateOfBirth': '11/24/1996'
		}, {
			'__v': 0,
			'_id': reserveIds[1],
			'code': generateReserveCode(),
			'userId': userIds[1],
			'departmentZone': 12,
			'departmentId': 3,
			'vaccinationDate': new Date(2022, 3, 27),
			'isProcessed': true,
			'vaccinationPeriodId': vaccinationPeriodIds[0],
			'vaccinationCenterId': vaccinationCenterId[0],
			'statusMessage': 'Reserva procesada correctamente',
			'timeStampInit': Date.now(),
			'timeStampFinish': Date.now(),
			'userPriority': 4,
			'userDateOfBirth': '01/15/1988'
		}])
	}
}

export default SeedMongoDb
