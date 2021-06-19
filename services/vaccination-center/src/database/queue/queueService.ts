import Queue, {Queue as QueueT} from 'bull'

class QueueService {
	private queueMap: { [index: string]: QueueT } = {}

	public createQueueId(departmentId: number, zoneId: number, date: Date): string {
		const dateFormatted = date.toISOString().slice(0, 10); // Y-m-d
		return `${departmentId}_${zoneId}_${dateFormatted}`
	}

	public createQueue(queueId: string) {
		this.queueMap[queueId] = new Queue(queueId)

		return this.queueMap[queueId]
	}

	public getQueue(queueId: string): QueueT | undefined {
		return this.queueMap[queueId]
	}

	public existsInQueue(queueId: string): boolean {
		return this.queueMap[queueId] !== undefined
	}

	public async insertToQueue(queueId: string, reservation: any) {
		const {data, priority} = reservation;
		return await this.queueMap[queueId].add(data, {priority});
	}
}

export default new QueueService();
