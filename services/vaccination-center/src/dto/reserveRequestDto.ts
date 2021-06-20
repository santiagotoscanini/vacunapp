type ReserveRequestModelAttributes = {
	department: number,
	departmentZone: number,
	turn: number,
	reserveDate: Date,
	userId: string,
	phone: string
}

export class ReserveRequestDto {
	attributes: ReserveRequestModelAttributes

	constructor(attributes: ReserveRequestModelAttributes) {
		this.attributes = attributes
	}
}
