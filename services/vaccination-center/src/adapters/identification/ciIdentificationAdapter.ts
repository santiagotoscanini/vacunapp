import { IdentificationAdapter } from './identificationAdapter'
import axios from 'axios'
import { RequestError } from '../../middlewares/errorHandler/RequestError'

class CiIdentificationAdapter implements IdentificationAdapter {
	public async getInformation(identifier: string) {
		const id_provider_host: string = process.env.ID_PROVIDER_MOCK_HOST || 'id-provider.com'
		const id_provider_url: string = `http://${id_provider_host}`
		try {
			const providerResponse = await axios.get(`${id_provider_url}/information/${identifier}`)
			return providerResponse.data
		} catch (e) {
			throw new RequestError('Id de usuario invalido.', 400)
		}
	}
}

export default new CiIdentificationAdapter()
