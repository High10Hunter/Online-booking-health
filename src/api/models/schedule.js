'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Schedule extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Doctor, Shift, Appointment }) {
			// define association here
			this.belongsTo(Doctor, {
				foreignKey: 'doctor_id',
				as: 'doctor',
				allowNull: false,
			});
			this.belongsTo(Shift, {
				foreignKey: 'shift_id',
				as: 'shift',
				allowNull: false,
			});
			this.hasMany(Appointment, {
				foreignKey: 'schedule_id',
				as: 'appointments',
				allowNull: false,
			});
		}
	}
	Schedule.init(
		{
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'schedules',
			modelName: 'Schedule',
			indexes: [
				{
					unique: true,
					fields: ['date', 'doctor_id', 'shift_id'],
				},
			],
		}
	);
	return Schedule;
};
