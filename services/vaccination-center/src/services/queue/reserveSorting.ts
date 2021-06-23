import * as fs from 'fs'
import { RequestError } from '../../middlewares/errorHandler/RequestError'

class ReserveSorting {
	public algorithmsDict: { [index: string]: any } = {}
	private currentSortingAlgorithm: string

	constructor() {
		fs.readdirSync(`${__dirname}/concreteQueueSorting/`)
			.forEach((file: string) => {
				console.log('Importing ', file, '...')
				const fileName = file.split('.')[0]
				this.algorithmsDict[fileName] = require(`./concreteQueueSorting/${file}`).default
			})
		this.currentSortingAlgorithm = Object.keys(this.algorithmsDict)[0]
	}

	public updateSortingAlgorithm(algorithm: string) {
		if (this.algorithmsDict.hasOwnProperty(algorithm)) {
			this.currentSortingAlgorithm = algorithm
		} else {
			throw new RequestError('Invalid algorithm.', 400)
		}
	}

	public getSortingAlgorithm() {
		return this.algorithmsDict[this.currentSortingAlgorithm]
	}
}

export default new ReserveSorting()