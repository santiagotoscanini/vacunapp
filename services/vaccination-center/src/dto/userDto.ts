type UserAttributes = {
	id: string,
	name: string,
	surname: string,
	secondSurname: string,
	dateOfBirth: Date
	priority: number
}

export class UserDto {
	attributes: UserAttributes

	constructor(attributes: UserAttributes) {
		this.attributes = attributes
	}
}