type VaccinationRegisterAttributes = {
	departmentZone: number | undefined
	departmentId: number | undefined
	age: number | undefined
	vaccinationDate: Date | undefined
	workingTime: number | undefined
}

export class VaccinationRegisterDto {
	attributes: VaccinationRegisterAttributes

	constructor(attributes: { departmentId: number | undefined; vaccinationDate: Date | undefined; departmentZone: number | undefined; age: number | undefined, workingTime: number | undefined }) {
		this.attributes = attributes
	}
}