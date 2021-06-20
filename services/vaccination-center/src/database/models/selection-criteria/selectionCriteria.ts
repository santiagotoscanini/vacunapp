import { getModelForClass, prop } from '@typegoose/typegoose'
import validations from '../model-utils/validations'

class SelectionCriteria {
	// @ts-ignore
	@prop({ type: String, required: validations.isCriteriaRequired })
	public criteria!: string
}

const SelectionCriteriaModel = getModelForClass(SelectionCriteria)

export {
	SelectionCriteria,
	SelectionCriteriaModel
}
