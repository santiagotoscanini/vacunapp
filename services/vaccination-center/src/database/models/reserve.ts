import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose';
import { VaccinationCenter } from './vaccination-center';
import { User } from './user';

const Crypto = require('crypto')

function generateReserveCode(): string {
	const length = +(process.env.USER_ID_LENGTH || 10);

	return Crypto
		.randomBytes(length)
		.toString('base64')
		.slice(0, length)
}

@pre<Reserve>('save', function () {
	this.code = generateReserveCode();
})

class Reserve {
	@prop({type: String, unique: true})
	public code?: string;

	@prop({ref: 'User', required: true})
	public userId?: Ref<User>;

	@prop({ref: 'VaccinationCenter'})
	public vaccinationCenterId?: Ref<VaccinationCenter>;

	@prop({type: Date})
	public vaccinationDay?: Date;

	@prop({type: String})
	public statusMessage?: string;

	@prop({type: Date, required: true})
	public timeStampInit?: Date;

	@prop({type: Date})
	public timeStampFinish?: Date;

	@prop({type: Number})
	public processTime?: number;
}

const ReserveModel = getModelForClass(Reserve);

export {
	Reserve,
	ReserveModel
}
