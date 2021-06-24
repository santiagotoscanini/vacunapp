import { getModelForClass, prop } from '@typegoose/typegoose'
import validations from './model-utils/validations'

class Reserve {
	@prop({ type: String, unique: true })
	public code?: string

	@prop({ type: Number, required: true, min: validations.minDepartmentId, max: validations.maxDepartmentId })
	public departmentId?: number

	@prop({ type: Number, required: true, min: validations.minDepartmentZone, max: validations.maxDepartmentZone })
	public departmentZone?: number

	@prop({ type: Date, required: true })
	public vaccinationDay?: Date

	@prop({ type: Boolean, required: true })
	public isProcessed?: boolean

	@prop({ type: String, enum: validations.reserveStatusMessages, required: true })
	public statusMessage?: string
}

const ReserveModel = getModelForClass(Reserve)

export {
	Reserve,
	ReserveModel
}
