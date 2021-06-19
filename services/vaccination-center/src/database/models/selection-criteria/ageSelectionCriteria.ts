import {prop, getDiscriminatorModelForClass} from "@typegoose/typegoose";
import {SelectionCriteria, SelectionCriteriaModel} from "./selectionCriteria";

const min = [18, 'Minimum Age supported is 18.']
const max = [106, 'Maximum Age supported is 106.']

const validator = function (this: any, value: number) {
	return value <= this.to;
}

class AgeSelectionCriteria extends SelectionCriteria {
	@prop({
		type: Number, default: 18, min, max,
		validate: {
			validator, message: "The Age from cannot be greater than age to."
		}
	})
	public from!: number

	@prop({type: Number, default: 106, min, max})
	public to!: number
}

export default getDiscriminatorModelForClass(SelectionCriteriaModel, AgeSelectionCriteria)
