'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('specialities', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			name: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			image: {
				type: DataTypes.STRING,
			},
		});
	},
	async down(queryInterface, DataTypes) {
		await queryInterface.dropTable('specialities');
	},
};
