import { User, Doctor, Speciality } from '../../models';
import { Op } from 'sequelize';
import { NotFoundError } from '../../errors';
import NodeCache from 'node-cache';

const myCache = new NodeCache();

const getAllDoctor = async (q = '', currentPage = 1, speciality_id) => {
	try {
		const limit = 10;
		if (currentPage < 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const offset = (currentPage - 1) * limit;

		if (speciality_id != undefined) {
			const { count, rows } = await User.findAndCountAll({
				offset: offset,
				limit: limit,
				where: {
					name: {
						[Op.iLike]: `%${q}%`,
					},
					status: true,
					role: 3,
					'$doctor.speciality_id$': speciality_id,
				},
				include: [
					{
						model: Doctor,
						as: 'doctor',
						attributes: ['id', 'speciality_id', 'rank'],
						required: false,
						subQuery: false,
						include: [
							{
								model: Speciality,
								as: 'speciality',
								attributes: ['name'],
								required: false,
								subQuery: false,
							},
						],
					},
				],
				attributes: {
					exclude: ['username', 'refresh_token', 'role', 'status'],
				},

				order: [['createdAt', 'DESC']],
			});

			if (count === 0) {
				return { rows: [], currentPage: 1, endPage: 1 };
			}

			const endPage = Math.ceil(count / limit);
			if (currentPage > endPage) throw new Error('Page is invalid');

			return { rows, currentPage, endPage };
		} else {
			const { count, rows } = await User.findAndCountAll({
				offset: offset,
				limit: limit,
				where: {
					name: {
						[Op.iLike]: `%${q}%`,
					},
					status: true,
					role: 3,
				},
				include: [
					{
						model: Doctor,
						as: 'doctor',
						attributes: ['id', 'speciality_id', 'rank'],
						required: false,
						subQuery: false,
						include: [
							{
								model: Speciality,
								as: 'speciality',
								attributes: ['name'],
								required: false,
								subQuery: false,
							},
						],
					},
				],
				attributes: {
					exclude: ['username', 'refresh_token', 'role', 'status'],
				},

				order: [['createdAt', 'DESC']],
			});

			console.log(rows);

			if (count === 0) {
				return { rows: [], currentPage: 1, endPage: 1 };
			}

			const endPage = Math.ceil(count / limit);
			if (currentPage > endPage) throw new Error('Page is invalid');

			return { rows, currentPage, endPage };
		}
	} catch (error) {
		throw new NotFoundError('Cannot get doctors');
	}
};

const getDoctorById = async id => {
	try {
		const doctor = await Doctor.findOne({
			where: { id },
			include: [
				{
					model: User,
					as: 'user',
					attributes: ['name', 'phone_number', 'email'],
				},
			],
			attributes: ['id', 'speciality_id', 'rank', 'price', 'description'],
		});

		if (!doctor) throw new Error('Doctor not found');

		return doctor;
	} catch (error) {
		throw new NotFoundError('Cannot get doctor');
	}
};

const getAllSpeciality = async () => {
	try {
		let specialitiesInCache = myCache.get('specialities');

		if (specialitiesInCache == undefined) {
			const specialities = await Speciality.findAll({
				attributes: ['id', 'name'],
			});

			specialitiesInCache = [];
			specialities.forEach(speciality => {
				specialitiesInCache.push({
					id: speciality.id,
					name: speciality.name,
				});
			});

			myCache.set('specialities', specialitiesInCache, 86400);
		}

		return specialitiesInCache;
	} catch (error) {
		throw new Error("Can't get specialities");
	}
};

const createDoctor = async data => {
	try {
		const doctor = await Doctor.create(data);

		return doctor;
	} catch (error) {
		throw new Error(error.message);
	}
};

const updateDoctor = async (id, data) => {
	try {
		const doctor = await Doctor.findByPk(id);
		doctor.set({
			...data,
		});
		await doctor.save();
		return doctor;
	} catch (error) {
		const { errors } = error;
		if (!errors) {
			throw new Error(error.message || 'Cannot update doctor');
		} else {
			throw new Error(errors[0].message || 'Cannot update doctor');
		}
	}
};

export default {
	getAllDoctor,
	getDoctorById,
	getAllSpeciality,
	createDoctor,
	updateDoctor,
};
