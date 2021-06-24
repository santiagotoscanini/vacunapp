type VaccinesGivenVaccinationCenterAttributes = {
	vaccinesGiven: number,
	vaccinesRemaining: number
}

export class VaccinesGivenVaccinationCenterDto {
	attributes: VaccinesGivenVaccinationCenterAttributes

	constructor(attributes: VaccinesGivenVaccinationCenterAttributes) {
		this.attributes = attributes
	}
}