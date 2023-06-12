'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('reviews', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
            doctor_id: {
				allowNull: false,
				type: DataTypes.INTEGER,
				references: {
					model: 'doctors',
					key: 'id',
				},
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
            comment: {
				type: DataTypes.TEXT,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		});
	},
	async down(queryInterface, DataTypes) {
		await queryInterface.dropTable('reviews');
	},
};