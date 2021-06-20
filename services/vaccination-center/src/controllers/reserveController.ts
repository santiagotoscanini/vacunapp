import { NextFunction, Request, Response } from 'express';
import ReserveService from '../services/reserveService';
import { RequestError } from '../middlewares/errorHandler/RequestError';
import { UserModel } from '../database/models/user';
import { ReserveRequestModel } from '../models/ReserveRequestModel';
import { ReserveModel } from '../database/models/reserve';

class ReserveController {
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, phone } = req.body;
			let user = await ReserveController.getUser(userId);

			if (!user) {
				const timeStampInit = Date.now();
				user = await ReserveController.saveUser(userId, phone);

				const requestModel = ReserveController.getReserveRequestModel(req.body);
				const reserveProcessModel = await ReserveService.createReserve(requestModel);
				const reserve = await ReserveController.saveReserve({
					user: user,
					reserveProcessModel: reserveProcessModel,
					timeStampInit: timeStampInit
				});

				res.status(200).json(reserve);
			} else {
				throw new RequestError('This user is already registered to vaccinate', 400);
			}
		} catch (e) {
			next(e);
		}
	}

	private static async saveUser(userId: string, phone: string) {
		const user = new UserModel({
			id: userId,
			phone: phone
		});
		await user.save();
		return user;
	}

	private static async getUser(userId: string) {
		return UserModel.findOne({ id: userId });
	}

	private static getReserveRequestModel(body: { [index: string]: any }) {
		const { reserveDate, department, departmentZone, turn } = body;
		return new ReserveRequestModel({
			// Month minus one, mongoose issue https://stackoverflow.com/questions/37388552/mongoose-increment-the-date-field-of-a-mongo-collection-by-one-month
			reserveDate: new Date(reserveDate['year'], reserveDate['month'] - 1, reserveDate['day']),
			department: department,
			departmentZone: departmentZone,
			turn: turn
		});
	}

	private static async saveReserve(body: { [index: string]: any }) {
		const { user, reserveProcessModel, timeStampInit } = body;
		const timeStampFinish = Date.now();
		const processTime = timeStampFinish - timeStampInit;
		const reserve = new ReserveModel({
			userId: user,
			vaccinationCenterId: reserveProcessModel.attributes.vaccinationCenterId,
			vaccinationDay: reserveProcessModel.attributes.vaccinationDay,
			statusMessage: reserveProcessModel.attributes.statusMessage,
			timeStampInit: timeStampInit,
			timeStampFinish: timeStampFinish,
			processTime: processTime
		});
		return reserve.save();
	}
}

export default new ReserveController();
