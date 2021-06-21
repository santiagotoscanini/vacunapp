import { MessageAdapter } from './messageAdapter'
import axios from 'axios'
import { SmsDto } from '../../dto/smsDto'

export class SmsMessageAdapter implements MessageAdapter {
	sendMessage(smsDto: SmsDto): Promise<any> {
		const sms_host: string = process.env.SMS_MOCK_HOST || 'sms-service.com'
		const sms_url: string = `http://${sms_host}`

		const message = `
		Código de reserva: ${smsDto.attributes.reserveCode}
		Cédula de Identidad: ${smsDto.attributes.identifier}
		
		Información de reserva:
		* Departamento: ${smsDto.attributes.department}
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
