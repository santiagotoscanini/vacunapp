import { IdentificationAdapter } from './identificationAdapter'
import axios from 'axios'
import { RequestError } from '../../middlewares/errorHandler/RequestError'
import { configIds, ConfigModel } from '../../database/models/config'

class CiIdentificationAdapter implements IdentificationAdapter {
	public async getInformation(identifier: string) {
		const id_provider_host = await ConfigModel.findOne({ id: configIds.idProviderUrl })
		const id_provider_url = id_provider_host!=undefined ? id_provider_host.data : `http://${process.env.ID_PROVIDER_MOCK_HOST}`
		try {
			const providerResponse = await axios.get(`${id_provider_url}/information/${identifier}`)
			return providerResponse.data
		} catch (e) {
			throw new RequestError('Id de usuario invalido.', 400)
		}
	}
}

export default new CiIdentificationAdapter()
