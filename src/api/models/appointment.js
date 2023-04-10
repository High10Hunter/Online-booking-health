'use strict';
const { Model } = require('sequelize');
const {
	default: AppointmentStatusEnum,
} = require('../enums/AppoimentStatusEnum');
module.exports = (sequelize, DataTypes) => {
	class Appointment extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Customer, Schedule, User }) {
			// define association here
			this.belongsTo(Customer, {
				foreignKey: 'customer_id',
				as: 'customer',
				allowNull: false,
			});
			this.belongsTo(Schedule, {
				foreignKey: 'schedule_id',
				as: 'schedule',
				allowNull: false,
			});
			this.belongsTo(User, {
				foreignKey: 'user_id',
				as: 'user',
				allowNull: true,
			});
		}
	}
	Appointment.init(
		{
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Description is required',
					},
					notNull: {
						msg: 'Description is required',
					},
				},
			},
			diagnosis: {
				type: DataTypes.TEXT,
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Price is required',
					},
					notNull: {
						msg: 'Price is required',
					},
				},
			},
			status: {
				type: DataTypes.SMALLINT,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Status is required',
					},
					notNull: {
						msg: 'Status is required',
					},
				},
				defaultValue: AppointmentStatusEnum.NOT_CONFIRMED,
			},
		},
		{
			sequelize,
			tableName: 'appointments',
			modelName: 'Appointment',
		}
	);
	return Appointment;
};
