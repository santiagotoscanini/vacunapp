'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Users', {
				email: {
					type: Sequelize.STRING,
					primaryKey: true
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false
				},
				roles: {
					type: Sequelize.STRING
				}
			}
		);
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Users');
	}
};
