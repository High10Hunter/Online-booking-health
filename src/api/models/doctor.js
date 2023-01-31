'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Doctor extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Speciality, User, Schedule }) {
			// define association here
			this.belongsTo(User, {
				foreignKey: 'user_id',
				as: 'user',
				unique: true,
				allowNull: false,
			});
			this.belongsTo(Speciality, {
				foreignKey: 'speciality_id',
				as: 'speciality',
				allowNull: false,
			});
			this.hasMany(Schedule, {
				foreignKey: 'doctor_id',
				as: 'schedules',
				allowNull: false,
			});
		}
	}
	Doctor.init(
		{
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
		},
		{
			sequelize,
			timestamps: true,
			updatedAt: false,
			tableName: 'doctors',
			modelName: 'Doctor',
		}
	);
	return Doctor;
};
