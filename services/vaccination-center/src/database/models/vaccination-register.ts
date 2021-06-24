import { getModelForClass, prop } from '@typegoose/typegoose'
import validations from './model-utils/validations'

class VaccinationRegister {
	@prop({ type: Number, required: true, min: validations.minDepartmentZone, max: validations.maxDepartmentZone })
	public departmentZone?: number

	@prop({ type: Number, required: true, min: validations.minDepartmentId, max: validations.maxDepartmentId })
	public departmentId?: number

	@prop({ type: Number, required: true })
	public age?: number

	@prop({ type: Date, required: true })
	public vaccinationDay?: Date

	@prop({type: Number, required: true, enum: validations.workingTime})
	public workingTime?: number
}

const VaccinationRegisterModel = getModelForClass(VaccinationRegister)

export {
	VaccinationRegister,
	VaccinationRegisterModel
}