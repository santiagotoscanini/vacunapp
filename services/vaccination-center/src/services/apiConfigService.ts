import { configIds, ConfigModel } from '../database/models/config'

class ApiConfigService {
	public async updateSmsUrl(url: string) {
		const config = await ConfigModel.findOne({ id: configIds.smsUrl })
		if (config) {
			config.data = url
			await config.save()
		}
	}

	public async updateIdProviderUrl(url: string) {
		const config = await ConfigModel.findOne({ id: configIds.idProviderUrl })
		if (config) {
			config.data = url
			await config.save()
		}
	}
}

export default new ApiConfigService()