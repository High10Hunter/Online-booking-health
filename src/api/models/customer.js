'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Customer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Appointment }) {
			// define association here
			this.hasMany(Appointment, {
				foreignKey: 'customer_id',
				as: 'appointments',
				allowNull: false,
			});
		}
	}
	Customer.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Name is required',
					},
					notNull: {
						msg: 'Name is required',
					},
				},
			},
			birthday: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Birthday is required',
					},
					notNull: {
						msg: 'Birthday is required',
					},
					isDate: {
						msg: 'Birthday must be date',
					},
					isBefore: {
						args: new Date().toISOString().split('T')[0],
						msg: 'Birthday must be before today',
					},
				},
			},
			gender: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Gender is required',
					},
					notNull: {
						msg: 'Gender is required',
					},
				},
			},
			phone_number: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					args: true,
					msg: 'This phone number has been used',
				},
				validate: {
					notEmpty: {
						msg: 'Phone number is required',
					},
					notNull: {
						msg: 'Phone number is required',
					},
					minLength(value) {
						if (value.length < 10) {
							throw new Error(
								'Phone number must be at least 10 digits'
							);
						}
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					args: true,
					msg: 'This email has been used',
				},
				validate: {
					notEmpty: {
						msg: 'Email is required',
					},
					notNull: {
						msg: 'Email is required',
					},
					isEmail: {
						msg: 'Invalid email',
					},
				},
			},
		},
		{
			sequelize,
			timestamps: true,
			updatedAt: false,
			tableName: 'customers',
			modelName: 'Customer',
		}
	);
	return Customer;
};
