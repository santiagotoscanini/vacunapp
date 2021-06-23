import { getModelForClass, prop } from '@typegoose/typegoose'
import validations from '../model-utils/validations'
import { User } from '../user'
import SelectionCriteriaValidation from '../selectionCriteriaValidation'

class SelectionCriteria implements SelectionCriteriaValidation {
	// @ts-ignore
	@prop({ type: String, required: validations.isCriteriaRequired })
	public criteria!: string

	validateUser(user: User): boolean {
		return true
	}
}

const SelectionCriteriaModel = getModelForClass(SelectionCriteria)

export {
	SelectionCriteria,
	SelectionCriteriaModel
}
