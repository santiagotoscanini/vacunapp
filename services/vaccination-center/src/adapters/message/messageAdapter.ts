import { SmsDto } from '../../dto/smsDto'

export interface MessageAdapter {
	sendMessage(smsDto: SmsDto): Promise<any>
}
