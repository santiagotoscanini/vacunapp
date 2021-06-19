type ReserveRequestModelAttributes = {
	department: number,
	departmentZone: number,
	turn: number,
	reserveDate: Date
}

export class ReserveRequestModel {
	attributes: ReserveRequestModelAttributes;

	constructor(attributes: ReserveRequestModelAttributes){
		this.attributes = attributes;
	}
}
