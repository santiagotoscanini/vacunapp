import { MessageAdapter } from './messageAdapter'
import axios from 'axios'
import { SmsDto } from '../../dto/smsDto'
import { configIds, ConfigModel } from '../../database/models/config'

export class SmsMessageAdapter implements MessageAdapter {
	public async sendMessage(smsDto: SmsDto): Promise<any> {
		const sms_host = await ConfigModel.findOne({ id: configIds.smsUrl })
		const sms_url = sms_host!=undefined ? sms_host.data : `http://${process.env.SMS_MOCK_HOST}`

		const message = `
		Código de reserva: ${smsDto.attributes.reserveCode}
		Cédula de Identidad: ${smsDto.attributes.identifier}
		
		Información de reserva:
		* Departamento: ${smsDto.attributes.departmentId}
		* Zona:${smsDto.attributes.identifier}
		* Código de vacunatorio: ${smsDto.attributes.vaccinationCenterCode}
		* Fecha: ${smsDto.attributes.date}
		
		Timestamps:
		* Inicio: ${smsDto.attributes.initTimeStamp}
		* Fin: ${smsDto.attributes.endTimeStamp}
		* Diferencia: ${smsDto.attributes.differenceTimeStamp}
		`

		return axios.post(`${sms_url}/sms/${smsDto.attributes.cellphone}`, { message })
	}
}
