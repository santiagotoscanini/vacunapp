type VaccinationRegisterAttributes = {
	departmentZone: number | undefined
	departmentId: number | undefined
	age: number | undefined
	vaccinationDay: Date | undefined
	workingTime: number | undefined
}

export class VaccinationRegisterDto {
	attributes: VaccinationRegisterAttributes

	constructor(attributes: { departmentId: number | undefined; vaccinationDay: Date | undefined; departmentZone: number | undefined; age: number | undefined, workingTime: number | undefined }) {
		this.attributes = attributes
	}
}