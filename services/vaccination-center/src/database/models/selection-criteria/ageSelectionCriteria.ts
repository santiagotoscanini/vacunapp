import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose'
import { SelectionCriteria, SelectionCriteriaModel } from './selectionCriteria'
import validations from '../model-utils/validations'
import { User } from '../user'

const validator = function(this: any, value: number) {
	return value <= this.to
}

class AgeSelectionCriteria extends SelectionCriteria {
	@prop({
		type: Number, default: validations.fromDefaultAge, min: validations.minAge, max: validations.maxAge,
		validate: {
			validator, message: validations.fromGreaterThanToErrorMessage
		}
	})
	public from!: number

	@prop({ type: Number, default: validations.toDefaultAge, min: validations.minAge, max: validations.maxAge })
	public to!: number

	validateUser(user: User): boolean {
		return user?.age >= this.from && user?.age <= this.to
	}
}

export default getDiscriminatorModelForClass(SelectionCriteriaModel, AgeSelectionCriteria)
