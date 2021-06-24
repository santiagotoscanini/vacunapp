import { getModelForClass, prop } from '@typegoose/typegoose'

const configIds = {
	currentSortingAlgorithm: 'current-sorting-algorithm',
	smsUrl: 'sms-url',
	idProviderUrl: 'id-provider-url'
}

class Config {
	@prop({ type: String, required: true, unique: true })
	public id?: string

	@prop({ type: String, required: true })
	public data?: string
}

const ConfigModel = getModelForClass(Config)

export {
	Config,
	ConfigModel,
	configIds
}
