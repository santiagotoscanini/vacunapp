import { VaccinationCenter } from '../database/models/vaccination-center'
import { Ref } from '@typegoose/typegoose'

type ReserveProcessModelAttributes = {
	vaccinationCenterId?: Ref<VaccinationCenter>,
	vaccinationDay?: Date,
	statusMessage: string,
	success: boolean
}

export class ReserveProcessDto {
	attributes: ReserveProcessModelAttributes

	constructor(attributes: ReserveProcessModelAttributes) {
		this.attributes = attributes
	}
}
