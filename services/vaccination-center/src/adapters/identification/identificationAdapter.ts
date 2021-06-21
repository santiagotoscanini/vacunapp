export interface IdentificationAdapter {
	getInformation(identifier: number): Promise<any>
}
