import { App } from './app';

import db from './database/models';
import { users } from './database/seeders/users';

async function main() {
	db.sequelize.sync()
		.then(async () => {
			await seedDbWithUsers();

			const app = new App();
			await app.listen();
		});
}

async function seedDbWithUsers() {
	users.map(async user => {
		const user_found = await db.User.findByPk(user.email);
		if (!user_found) {
			await db.User.create(user);
		}
	});
}

main();
