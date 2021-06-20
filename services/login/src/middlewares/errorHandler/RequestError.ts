export class RequestError extends Error {
	public status: number;

	constructor(message?: string, status?: number) {
		super(message || 'Unknown Error');
		this.status = status || 500;
	}
}
