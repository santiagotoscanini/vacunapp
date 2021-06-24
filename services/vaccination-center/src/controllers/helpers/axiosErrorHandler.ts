import { AxiosError } from 'axios'
import { RequestError } from '../../middlewares/errorHandler/RequestError'
import { NextFunction } from 'express'

export default (err: AxiosError, next: NextFunction) => {
	if (err.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		next(new RequestError(err.response.data.message, err.response.status))
	} else if (err.request) {
		// The request was made but no response was received
		// `error.request` is an instance of http.ClientRequest
		next(new RequestError(err.request.data, err.request.status))
	} else {
		// Something happened in setting up the request that triggered an Error
		next(new RequestError('Internal server error', 500))
	}
}
