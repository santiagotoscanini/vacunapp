import { VaccinationCenter } from '../database/models/vaccination-center'
import { Ref } from '@typegoose/typegoose'
import { VaccinationPeriod } from '../database/models/vaccination-period'

type ReserveProcessModelAttributes = {
	vaccinationCenterId?: Ref<VaccinationCenter>,
	vaccinationPeriodId?: Ref<VaccinationPeriod>,
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
