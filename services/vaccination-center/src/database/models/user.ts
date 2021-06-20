import { getModelForClass, prop } from '@typegoose/typegoose'

class User {
	@prop({ type: String, required: true, unique: true })
	public id?: string

	@prop({ type: Number, required: true })
	public phone?: number
}

const UserModel = getModelForClass(User)

export {
	User,
	UserModel
}
