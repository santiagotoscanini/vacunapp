import { Document, Model, model, Schema } from 'mongoose';

export interface IVaccinationCenter extends Document {
	id: string;
	name: string;
	workingTime: number;
	department: number;
	departmentZone: number;
}

const vaccinationCenterSchema: Schema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	workingTime: {
		type: Number,
		required: true
	},
	department: {
		type: Number,
		required: true
	},
	departmentZone: {
		type: Number,
		required: true
	}
});

const VaccinationCenter: Model<IVaccinationCenter> = model('VaccinationCenter', vaccinationCenterSchema);

export default VaccinationCenter;
