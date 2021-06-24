import { getModelForClass, pre, prop, Ref } from '@typegoose/typegoose'
import { VaccinationCenter } from './vaccination-center'
import { User } from './user'
import { VaccinationPeriod } from './vaccination-period'
import validations from './model-utils/validations'

const Crypto = require('crypto')

function generateReserveCode(): string {
	const length = 10

	return Crypto
		.randomBytes(length)
		.toString('hex')
		.slice(0, length)
}

@pre<Reserve>('save', function() {
	this.code = generateReserveCode()
})

class Reserve {
	@prop({ type: String, unique: true })
	public code?: string

	@prop({ ref: 'User', required: true })
	public userId?: Ref<User>

	@prop({ type: Number, required: true, min: validations.minDepartmentId, max: validations.maxDepartmentId })
	public departmentId?: number

	@prop({
		type: Number,
		required: true,
		min: validations.minDepartmentZone,
		max: validations.maxDepartmentZone,
		validate: validations.validateDepartmentZoneVaccinationCenterExist
	})
	public departmentZone?: number

	@prop({ type: Date, required: true, validate: validations.validateReserveDate })
	public vaccinationDate?: Date

	@prop({ type: Date, required: true })
	public userDateOfBirth?: Date

	@prop({ type: Number, required: true })
	public userPriority?: number

	@prop({ type: Boolean, required: true })
	public isProcessed?: boolean

	@prop({ ref: 'VaccinationPeriod' })
	public vaccinationPeriodId?: Ref<VaccinationPeriod>

	@prop({ ref: 'VaccinationCenter' })
	public vaccinationCenterId?: Ref<VaccinationCenter>

	@prop({ type: String, enum: validations.reserveStatusMessages, required: true })
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
				vaccinationDate: this.vaccinationDate,
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
