import { getModelForClass, prop } from '@typegoose/typegoose'
import validations from '../models/model-utils/validations'

class VaccinationCenter {
	@prop({ type: String, required: true, unique: true })
	public id?: string

	@prop({ type: String, required: true })
	public name?: string

	@prop({ type: Number, required: true, enum: validations.workingTime })
	public workingTime?: number

	@prop({ type: Number, required: true, min: validations.minDepartmentId, max: validations.maxDepartmentId })
	public department?: number

	@prop({ type: Number, required: true, min: validations.minDepartmentZone, max: validations.maxDepartmentZone })
	public departmentZone?: number
}

const VaccinationCenterModel = getModelForClass(VaccinationCenter)

export {
	VaccinationCenter,
	VaccinationCenterModel
}
