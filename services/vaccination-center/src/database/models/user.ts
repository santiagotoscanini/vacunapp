import { getModelForClass, prop } from '@typegoose/typegoose'
import validations from './model-utils/validations'

class User {
	@prop({ type: String, required: true, unique: true, validate: validations.validateIdentificationNumber })
	public id?: string

	@prop({ type: String, required: true })
	public name?: string

	@prop({ type: String, required: true })
	public surname?: string

	@prop({ type: String, required: true })
	public secondSurname?: string

	@prop({ type: Date, required: true })
	public dateOfBirth?: Date

	@prop({ type: Number, required: true })
	public priority?: number

	@prop({ type: String, required: true, validate: validations.validatePhone })
	public phone?: string
}

const UserModel = getModelForClass(User)

export {
	User,
	UserModel
}
