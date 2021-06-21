export interface AuthenticationAdapter {
	login(username: string, password: string): Promise<any>
}
