import { IdentificationAdapter } from './identificationAdapter';
import axios from 'axios'

export class CiIdentificationAdapter implements IdentificationAdapter{
	getInformation(identifier: number): Promise<any> {
		const id_provider_host: string = process.env.ID_PROVIDER_MOCK_HOST || 'id-provider.com'
		const id_provider_url: string = `http://${id_provider_host}`

		return axios.get(`${id_provider_url}/information/${identifier}`)
	}
}
