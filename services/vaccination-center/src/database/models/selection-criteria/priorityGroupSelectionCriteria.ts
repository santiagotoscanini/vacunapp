import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose'
import { SelectionCriteria, SelectionCriteriaModel } from './selectionCriteria'
import validations from '../model-utils/validations'
import { User } from '../user'

class PriorityGroupSelectionCriteria extends SelectionCriteria {
	@prop({
		type: Number,
		// @ts-ignore
		required: validations.isGroupRequired,
		min: validations.minPriorityGroup,
		max: validations.maxPriorityGroup
	})
	public group!: number

	validateUser(user: User): boolean {
		return user?.priority == this.group
	}
}

export default getDiscriminatorModelForClass(SelectionCriteriaModel, PriorityGroupSelectionCriteria)
