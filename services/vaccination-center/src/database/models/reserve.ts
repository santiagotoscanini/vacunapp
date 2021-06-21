import { getModelForClass, modelOptions, pre, prop, Ref } from '@typegoose/typegoose'
import { VaccinationCenter } from './vaccination-center'
import { User } from './user'
import { VaccinationPeriod } from './vaccination-period'

const Crypto = require('crypto')

function generateReserveCode(): string {
	const length = 10

	return Crypto
		.randomBytes(length)
		.toString('base64')
		.slice(0, length)
}

@pre<Reserve>('save', function() {
	this.code = generateReserveCode()
})
@modelOptions({
	schemaOptions: {
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
})
class Reserve {
	@prop({ type: String, unique: true })
	public code?: string

	@prop({ ref: 'User', required: true })
	public userId?: Ref<User>

	@prop({ type: Number, required: true, min: 1, max: 19 })
	public departmentId?: number

	@prop({ type: Number, required: true, min: 1, max: 50 })
	public departmentZone?: number

	@prop({ type: Date, required: true })
	public vaccinationDay?: Date

	@prop({ type: Boolean, required: true })
	public isProcessed?: boolean

	@prop({ ref: 'VaccinationPeriod' })
	public vaccinationPeriodId?: Ref<VaccinationPeriod>

	@prop({ ref: 'VaccinationCenter' })
	public vaccinationCenterId?: Ref<VaccinationCenter>

	@prop({ type: String, required: true })
	public statusMessage?: string

	@prop({ type: Date, required: true })
	public timeStampInit?: Date

	@prop({ type: Date, required: true })
	public timeStampFinish?: Date

	public get processTime() {
		if (this.timeStampFinish && this.timeStampInit) {
			return this.timeStampFinish?.getTime() - this.timeStampInit?.getTime()
		} else {
			return 0
		}
	}

	public get toJson() {
		let reserve: any = {
			code: this.code,
			// @ts-ignore
			userId: this.userId.id,
			timeStampInit: this.timeStampInit,
			timeStampFinish: this.timeStampFinish,
			processTime: this.processTime
		}
		if (this.isProcessed) {
			reserve = {
				vaccinationDay: this.vaccinationDay,
				// @ts-ignore
				vaccinationCenterId: this.vaccinationCenterId.id,
				...reserve
			}
		}
		return reserve
	}
}

const ReserveModel = getModelForClass(Reserve)

export {
	Reserve,
	ReserveModel,
	generateReserveCode
}
