const fs = require('fs');

class SelectionCriteriaImporter {
	public selectionCriteriaDict: { [index: string]: any } = {};
	private baseCriteriaFileName = 'selectionCriteria.ts'

	constructor() {
		this.preImportAllCriteria()
	}

	// This it's to pre-load all the selection criteria, because if instead we load at the moment we need every request will take too long.
	private preImportAllCriteria() {
		fs.readdirSync(`${__dirname}/../database/models/selection-criteria`)
			.filter((file: string) => file != this.baseCriteriaFileName)
			.forEach((file: string) => {
				// With this we remove the last 'SelectionCriteria.ts' of every file.
				const criteriaName = file.slice(0, -(this.baseCriteriaFileName.length))
				this.selectionCriteriaDict[criteriaName] = require(`./models/selection-criteria/${criteriaName}SelectionCriteria`).default
			});
	}

	public getSelectionCriteriaModelByType(selectionCriteriaType: string) {
		return this.selectionCriteriaDict[selectionCriteriaType]
	}
}

export default new SelectionCriteriaImporter();
