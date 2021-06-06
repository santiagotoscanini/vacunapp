import { App } from './app';

import { vaccinationCenters } from './database/seeders/vaccination-centers';
import connectDB from './database/config';
import VaccinationCenter from './database/models/vaccination-center';

async function main() {
	await connectDB();
	await seedDbWithUsers();

	const app = new App();
	await app.listen();
}

async function seedDbWithUsers() {
	vaccinationCenters.map(async vac_center => {
		let vaccinationCenter = await VaccinationCenter.findOne({ id: vac_center.id });

		if (!vaccinationCenter) {
			vaccinationCenter = new VaccinationCenter(vac_center);
			await vaccinationCenter.save();
		}
	});
}

main();
