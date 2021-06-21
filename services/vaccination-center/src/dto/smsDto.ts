type SmsModelAttributes = {
	cellphone: string
	reserveCode: number
	identifier: number
	department: string
	vaccinationCenterCode: string
	date: string
	initTimeStamp: string
	endTimeStamp: string
	differenceTimeStamp: string
}

export class SmsDto {
	attributes: SmsModelAttributes

	constructor(attributes: SmsModelAttributes) {
		this.attributes = attributes
	}
}
