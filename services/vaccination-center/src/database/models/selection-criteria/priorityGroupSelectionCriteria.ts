import {prop, getDiscriminatorModelForClass} from "@typegoose/typegoose";
import {SelectionCriteria, SelectionCriteriaModel} from "./selectionCriteria";

const min = [1, 'Minimum priority group is 1.']
const max = [106, 'Maximum priority group is 4.']

class PriorityGroupSelectionCriteria extends SelectionCriteria {
	@prop({type: Number, required: [true, 'Priority group is required.'], min, max})
	public group!: number;
}

export default getDiscriminatorModelForClass(SelectionCriteriaModel, PriorityGroupSelectionCriteria)
