'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { default: RolesEnum } = require('../enums/RolesEnum');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Doctor, Appointment }) {
			// define association here
			this.hasOne(Doctor, {
				foreignKey: 'user_id',
				as: 'doctor',
				allowNull: false,
			});
			this.hasMany(Appointment, {
				foreignKey: 'user_id',
				as: 'appointments',
				allowNull: false,
			});
		}

		toJSON() {
			return {
				...this.get(),
				id: undefined,
				password: undefined,
				createdAt: undefined,
			};
		}

		getRole() {
			if (this.role === RolesEnum.ADMIN) return 'admin';
			else if (this.role === RolesEnum.NURSE) return 'nurse';
			else if (this.role === RolesEnum.DOCTOR) return 'doctor';
			else return '';
		}
	}
	User.init(
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
			avatar: {
				type: DataTypes.STRING,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: {
					args: true,
					msg: 'This username has been used',
				},
				validate: {
					notEmpty: {
						msg: 'Username is required',
					},
					notNull: {
						msg: 'Username is required',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Password is required',
					},
					notNull: {
						msg: 'Password is required',
					},
					minLength(value) {
						if (value.length < 8) {
							throw new Error(
								'Password must be at least 8 characters'
							);
						}
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
			role: {
				type: DataTypes.SMALLINT,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Role is required',
					},
					notNull: {
						msg: 'Role is required',
					},
					isIn: {
						args: [[1, 2, 3]],
						msg: 'Role must be 1, 2 or 3',
					},
				},
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			refresh_token: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: [],
				allowNull: true,
			},
		},
		{
			sequelize,
			timestamps: true,
			updatedAt: false,
			tableName: 'users',
			modelName: 'User',
		}
	);

	User.prototype.isValidPassword = async function (password) {
		try {
			return await bcrypt.compare(password, this.password);
		} catch (error) {
			throw new Error(error);
		}
	};

	User.prototype.getGenderName = function () {
		if (this.gender == true) return 'Nam';
		else return 'Nữ';
	};

	return User;
};
