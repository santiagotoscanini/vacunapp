import {Request, Response} from 'express';

import {VaccinationPeriodModel} from "../database/models/vaccination-period";
import {VaccinationCenterModel} from '../database/models/vaccination-center';
import SelectionCriteriaImporter from "../database/selectionCriteriaImporter"
import QueueService from "../database/queue/queueService"

class VaccinationPeriodController {
	public async create(req: Request, res: Response) {
		const {vaccinationCenterId, selectionCriteria} = req.body;

		// Invalid cases.
		if (Object.keys(selectionCriteria).length !== 1) {
			res.status(400).json({'message': 'Exactly one selection criteria has to be sent.'})
			return;
		}
		let vaccinationCenterDocument = await VaccinationCenterModel.findOne({id: vaccinationCenterId});
		if (!vaccinationCenterDocument) {
			res.status(400).json({'message': 'The vaccination center doesn\'t exist.'});
			return;
		}

		const selectionCriteriaType: string = Object.keys(selectionCriteria)[0]

		const bodyToSaveSelectionCriteria = VaccinationPeriodController.getBodyToSaveSelectionCriteria(selectionCriteriaType, selectionCriteria);
		const selectionCriteriaModel = SelectionCriteriaImporter.getSelectionCriteriaModelByType(selectionCriteriaType);
		let selectionCriteriaDocument = await selectionCriteriaModel.create(bodyToSaveSelectionCriteria);

		const bodyToSaveVaccinationPeriod = VaccinationPeriodController.getBodyToSaveVaccinationPeriod(req.body, selectionCriteriaDocument, vaccinationCenterDocument)
		const vaccinationPeriod = await VaccinationPeriodModel.create(bodyToSaveVaccinationPeriod)

		res.status(200).json({'_id': vaccinationPeriod._id})
	}

	private static getBodyToSaveSelectionCriteria(selectionCriteriaType: string, selectionCriteria: { [index: string]: any }) {
		const selectionCriteriaData = selectionCriteria[selectionCriteriaType]
		selectionCriteriaData['criteria'] = selectionCriteriaType

		return selectionCriteriaData
	}

	private static getBodyToSaveVaccinationPeriod(body: { [index: string]: any }, selectionCriteria: any, vaccinationCenter: any) {
		const {departmentId, departmentZone, dateFrom, dateTo, amountOfVaccines} = body
		return {
			departmentId,
			departmentZone,
			amountOfVaccines,
			'selectionCriteriaId': selectionCriteria._id,
			'vaccinationCenterId': vaccinationCenter._id,
			// Month minus one, mongoose issue https://stackoverflow.com/questions/37388552/mongoose-increment-the-date-field-of-a-mongo-collection-by-one-month
			'dateFrom': new Date(dateFrom['year'], dateFrom['month'] - 1, dateFrom['day']),
			'dateTo': new Date(dateTo['year'], dateTo['month'], dateTo['day'])
		}
	}
}

export default new VaccinationPeriodController();
