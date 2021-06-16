import { Request, Response } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';

class VaccinationCenterController {

	public async create(req: Request, res: Response) {
		const vaccination_center_host: string = process.env.VACCINATION_CENTER_HOST || 'vaccination-center-service.com';
		const vaccination_center_url: string = `http://${vaccination_center_host}`;

		const body = req.body;
		axios
			.post(`${vaccination_center_url}/vaccination-centers`, body)
			.then((data: AxiosResponse) =>
				res
					.status(201)
					.send(data)
			)
			.catch((err: AxiosError) => {
				res
					.status(<number>err.response?.status)
					.send(err.response?.data);
			});
	}
}

export const vaccinationCenterController: VaccinationCenterController = new VaccinationCenterController();
