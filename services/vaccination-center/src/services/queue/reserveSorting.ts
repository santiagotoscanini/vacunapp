import * as fs from 'fs'
import { RequestError } from '../../middlewares/errorHandler/RequestError'
import { configIds, ConfigModel } from '../../database/models/config'

class ReserveSorting {
	public algorithmsDict: { [index: string]: any } = {}

	constructor() {
		fs.readdirSync(`${__dirname}/concreteQueueSorting/`)
			.forEach((file: string) => {
				console.log('Importing ', file, '...')
				const fileName = file.split('.')[0]
				this.algorithmsDict[fileName] = require(`./concreteQueueSorting/${file}`).default
			})
	}

	public async updateSortingAlgorithm(algorithm: string) {
		if (this.algorithmsDict.hasOwnProperty(algorithm)) {
			const config = await ConfigModel.findOne({ id: configIds.currentSortingAlgorithm })
			// @ts-ignore
			config.data = algorithm
			// @ts-ignore
			await config.save()
		} else {
			throw new RequestError('Opcion Invalida.', 400)
		}
	}

	public async getSortingAlgorithm() {
		const config = await ConfigModel.findOne({ id: configIds.currentSortingAlgorithm })
		// @ts-ignore
		return config ? this.algorithmsDict[config.data] : this.algorithmsDict[0]
	}
}

export default new ReserveSorting()