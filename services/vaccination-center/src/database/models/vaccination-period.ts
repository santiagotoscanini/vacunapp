import {getModelForClass, prop, Ref} from "@typegoose/typegoose";
import {SelectionCriteria} from "./selection-criteria/selectionCriteria";
import {VaccinationCenter} from "./vaccination-center";
import validations from '../models/model-utils/validations';

class VaccinationPeriod {
	@prop({type: Number, required: true, min: validations.minDepartmentId, max: validations.maxDepartmentId})
	public departmentId?: number;

	@prop({type: Number, required: true, min: validations.minDepartmentZone, max: validations.maxDepartmentZone})
	public departmentZone?: number;

	@prop({ref: 'VaccinationCenter', required: true})
	public vaccinationCenterId?: Ref<VaccinationCenter>;

	@prop({type: Date, required: true})
	public dateFrom?: Date;

	@prop({type: Date, required: true})
	public dateTo?: Date;

	@prop({type: Number, required: true, min: validations.minAmountOfVaccines})
	public amountOfVaccines?: number;

	@prop({ref: 'SelectionCriteria', required: true})
	public selectionCriteriaId?: Ref<SelectionCriteria>
}

const VaccinationPeriodModel = getModelForClass(VaccinationPeriod);

export {
	VaccinationPeriod,
	VaccinationPeriodModel
}

