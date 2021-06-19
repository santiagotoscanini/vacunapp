import {getModelForClass, prop, Ref} from "@typegoose/typegoose";
import {SelectionCriteria} from "./selection-criteria/selectionCriteria";
import {VaccinationCenter} from "./vaccination-center";

class VaccinationPeriod {
	@prop({type: Number, required: true})
	public departmentId?: number;

	@prop({type: Number, required: true, min: 1, max: 50})
	public departmentZone?: number;

	@prop({ref: 'VaccinationCenter', required: true})
	public vaccinationCenterId?: Ref<VaccinationCenter>;

	@prop({type: Date, required: true})
	public dateFrom?: Date;

	@prop({type: Date, required: true})
	public dateTo?: Date;

	@prop({type: Number, required: true, min: 1})
	public amountOfVaccines?: number;

	@prop({ref: 'SelectionCriteria', required: true})
	public selectionCriteriaId?: Ref<SelectionCriteria>
}

const VaccinationPeriodModel = getModelForClass(VaccinationPeriod);

export {
	VaccinationPeriod,
	VaccinationPeriodModel
}
