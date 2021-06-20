import { NextFunction, Request, Response } from 'express';

import { VaccinationPeriodModel } from '../database/models/vaccination-period';
import { VaccinationCenterModel } from '../database/models/vaccination-center';
import SelectionCriteriaImporter from '../database/selectionCriteriaImporter';
import { RequestError } from '../middlewares/errorHandler/RequestError';

class VaccinationPeriodController {
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { vaccinationCenterId, selectionCriteria } = req.body;

			// Invalid cases.
			if (Object.keys(selectionCriteria).length !== 1) {
				throw new RequestError('Exactly one selection criteria has to be sent.', 400);
				return;
			}
			let vaccinationCenterDocument = await VaccinationCenterModel.findOne({ id: vaccinationCenterId });
			if (!vaccinationCenterDocument) {
				throw new RequestError('The vaccination center doesn\'t exist.', 400);
				return;
			}

			const selectionCriteriaType: string = Object.keys(selectionCriteria)[0];

			const bodyToSaveSelectionCriteria = VaccinationPeriodController.getBodyToSaveSelectionCriteria(selectionCriteriaType, selectionCriteria);
			const selectionCriteriaModel = SelectionCriteriaImporter.getSelectionCriteriaModelByType(selectionCriteriaType);
			let selectionCriteriaDocument = await selectionCriteriaModel.create(bodyToSaveSelectionCriteria);

			const bodyToSaveVaccinationPeriod = VaccinationPeriodController.getBodyToSaveVaccinationPeriod(req.body, selectionCriteriaDocument, vaccinationCenterDocument);
			const vaccinationPeriod = await VaccinationPeriodModel.create(bodyToSaveVaccinationPeriod);

			res.status(200).json({ '_id': vaccinationPeriod._id });
		} catch (e) {
			next(e);
		}
	}

	private static getBodyToSaveSelectionCriteria(selectionCriteriaType: string, selectionCriteria: { [index: string]: any }) {
		const selectionCriteriaData = selectionCriteria[selectionCriteriaType];
		selectionCriteriaData['criteria'] = selectionCriteriaType;

		return selectionCriteriaData;
	}

	private static getBodyToSaveVaccinationPeriod(body: { [index: string]: any }, selectionCriteria: any, vaccinationCenter: any) {
		const { departmentId, departmentZone, dateFrom, dateTo, amountOfVaccines } = body;
		return {
			departmentId,
			departmentZone,
			amountOfVaccines,
			'selectionCriteriaId': selectionCriteria._id,
			'vaccinationCenterId': vaccinationCenter._id,
			'dateFrom': new Date(dateFrom['year'], dateFrom['month'], dateFrom['day']),
			'dateTo': new Date(dateTo['year'], dateTo['month'], dateTo['day'])
		};
	}
}

export default new VaccinationPeriodController();
