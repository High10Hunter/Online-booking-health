'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, DataTypes) {
		await queryInterface.createTable('doctors', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			description: {
				type: DataTypes.TEXT,
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			rank: {
				type: DataTypes.SMALLINT,
			},
			speciality_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'specialities',
					key: 'id',
				},
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				unique: true,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		});
	},
	async down(queryInterface, DataTypes) {
		await queryInterface.dropTable('doctors');
	},
};
