import { Request, Response } from 'express';
import VaccinationCenter from '../database/models/vaccination-center';

class VaccinationCenterController {
	public async create(req: Request, res: Response) {
		const { id, name, workingTime, department, departmentZone } = req.body;

		let vaccinationCenter = await VaccinationCenter.findOne({ id: id });

		if (!vaccinationCenter) {
			vaccinationCenter = new VaccinationCenter({
				id: id,
				name: name,
				workingTime: workingTime,
				department: department,
				departmentZone: departmentZone
			});

			await vaccinationCenter.save();

			res.status(200).json(vaccinationCenter);
		} else {
			res.status(400).json({ 'message': 'This vaccination center ID is being used' });
		}
	}
}

export const vaccinationCenterController: VaccinationCenterController = new VaccinationCenterController();
