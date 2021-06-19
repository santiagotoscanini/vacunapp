import {prop, getModelForClass} from "@typegoose/typegoose";

class SelectionCriteria {
	@prop({type: String, required: [true, 'Criteria is required.']})
	public criteria!: string;
}

const SelectionCriteriaModel = getModelForClass(SelectionCriteria)

export {
	SelectionCriteria,
	SelectionCriteriaModel
}
