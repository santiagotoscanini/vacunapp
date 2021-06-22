import { ReserveRequestDto } from '../dto/reserveRequestDto'
import { UserModel } from '../database/models/user'
import { CiIdentificationAdapter } from '../adapters/identification/ciIdentificationAdapter'

class UserService {
	public static async createUser(reserveRequestDto: ReserveRequestDto) {
		const ciService = new CiIdentificationAdapter()
		const userInformation = await ciService.getInformation(reserveRequestDto.attributes.userId)
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
}

export default UserService
