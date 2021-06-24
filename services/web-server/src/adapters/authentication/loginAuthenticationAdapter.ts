import { AuthenticationAdapter } from './authenticationAdapter'
import axios from 'axios'

class LoginAuthenticationAdapter implements AuthenticationAdapter {

	public async login(username: string, password: string): Promise<any> {
		const login_host: string = process.env.LOGIN_HOST || 'login-service.com'
		const login_url: string = `http://${login_host}`

		return axios.post(`${login_url}/login`, { email: username, password: password })
	}
}

export default new LoginAuthenticationAdapter()
