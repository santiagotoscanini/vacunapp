import { UserDto } from '../../dto/userDto'

export interface IdentificationAdapter {
	getInformation(identifier: string): Promise<UserDto>
}
