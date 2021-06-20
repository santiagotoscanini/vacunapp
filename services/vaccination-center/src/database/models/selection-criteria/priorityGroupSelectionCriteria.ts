import { getDiscriminatorModelForClass, prop } from '@typegoose/typegoose';
import { SelectionCriteria, SelectionCriteriaModel } from './selectionCriteria';
import validations from '../model-utils/validations';

class PriorityGroupSelectionCriteria extends SelectionCriteria {
	@prop({
		type: Number,
		// @ts-ignore
		required: validations.isGroupRequired,
		min: validations.minPriorityGroup,
		max: validations.maxPriorityGroup
	})
	public group!: number;
}

export default getDiscriminatorModelForClass(SelectionCriteriaModel, PriorityGroupSelectionCriteria);
