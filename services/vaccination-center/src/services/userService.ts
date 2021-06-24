import { ReserveRequestDto } from '../dto/reserveRequestDto'
import { UserModel } from '../database/models/user'
import CiIdentificationAdapter from '../adapters/identification/ciIdentificationAdapter'
import { Types } from 'mongoose'
import { RequestError } from '../middlewares/errorHandler/RequestError'

class UserService {
	public static async createUser(reserveRequestDto: ReserveRequestDto) {
		const userInformation = await CiIdentificationAdapter.getInformation(reserveRequestDto.attributes.userId)
		const user = new UserModel({
			id: reserveRequestDto.attributes.userId,
			phone: reserveRequestDto.attributes.phone,
			name: userInformation.name,
			surname: userInformation.surname,
			secondSurname: userInformation.secondSurname,
			dateOfBirth: userInformation.dateOfBirth,
			priority: userInformation.priority
		})
		await user.validate()
		return user
	}

	public static async getUser(userId: string) {
		return UserModel.findOne({ id: userId })
	}

	public static async getUserIdentifier(userId: string) {
		const user = await UserModel.findOne({ _id: new Types.ObjectId(userId) })
		if (!user) {
			throw new RequestError('No existe el usuario')
		}
		return user.id
	}

	public static async deleteUser(userId: string) {
		await UserModel.deleteOne({ id: userId })
	}
}

export default UserService
