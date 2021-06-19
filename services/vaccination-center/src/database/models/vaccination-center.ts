import { getModelForClass, prop } from '@typegoose/typegoose';

class VaccinationCenter {
	@prop({type: String, required: true, unique: true})
	public id?: string;

	@prop({type: String, required: true})
	public name?: string;

	@prop({type: Number, required: true, enum: [1, 2, 3]})
	public workingTime?: number;

	@prop({type: Number, required: true, min: 1, max: 19})
	public department?: number;

	@prop({type: Number, required: true, min: 1, max: 50})
	public departmentZone?: number;
}

const VaccinationCenterModel = getModelForClass(VaccinationCenter);

export {
	VaccinationCenter,
	VaccinationCenterModel
}
