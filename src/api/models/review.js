'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Review extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate({ Doctor }) {
			// define association here
			this.belongsTo(Doctor, {
				foreignKey: 'doctor_id',
				as: 'doctor',
				allowNull: false,
			});
		}
	}
	Review.init(
		{
			doctor_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Doctor id is required',
					},
					notNull: {
						msg: 'Doctor id is required',
					},
				},
			},
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
			phone_number: {
				type: DataTypes.STRING,
				allowNull: false,
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
			comment: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: {
						msg: 'Comment is required',
					},
					notNull: {
						msg: 'Comment is required',
					},
				},
			},
		},
		{
			sequelize,
            timestamps: true,
			updatedAt: false,
			tableName: 'reviews',
			modelName: 'Review',
		}
	);
	return Review;
};
