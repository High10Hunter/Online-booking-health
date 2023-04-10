import { User, Doctor, Speciality, Schedule, Shift } from '../../models';
import { Op } from 'sequelize';
import { NotFoundError } from '../../errors';
import NodeCache from 'node-cache';
import moment from 'moment';

const myCache = new NodeCache();

const getAllDoctor = async (q = '', currentPage = 1, speciality_id) => {
	try {
		const limit = 5;
		if (currentPage < 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const offset = (currentPage - 1) * limit;

		if (speciality_id) {
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
						attributes: [
							'id',
							'speciality_id',
							'rank',
							'price',
							'description',
						],
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
							{
								model: Schedule,
								as: 'schedules',
								required: false,
								subQuery: false,
								where: {
									// having the date is greater than today to the next 7 days
									date: {
										[Op.gte]: moment().format('YYYY-MM-DD'),
										[Op.lte]: moment()
											.add(7, 'days')
											.format('YYYY-MM-DD'),
									},
								},
								attributes: ['date'],
								order: [['date', 'ASC']],
							},
						],
					},
				],
				attributes: {
					exclude: ['username', 'refresh_token', 'role', 'status'],
				},
				order: [
					[
						{
							model: Doctor,
							as: 'doctor',
						},
						{
							model: Schedule,
							as: 'schedules',
						},
						'date',
						'ASC',
					],
				],
			});

			if (count === 0) {
				return { rows: [], currentPage: 1, endPage: 1 };
			}

			const endPage = Math.ceil(count / limit);
			if (currentPage > endPage) throw new Error('Page is invalid');

			return { rows, currentPage, endPage };
		} else {
			let { count, rows } = await User.findAndCountAll({
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
						attributes: [
							'id',
							'speciality_id',
							'rank',
							'price',
							'description',
						],
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
							{
								model: Schedule,
								as: 'schedules',
								required: false,
								subQuery: false,
								where: {
									// having the date is greater than today to the next 7 days
									date: {
										[Op.gte]: moment().format('YYYY-MM-DD'),
										[Op.lte]: moment()
											.add(7, 'days')
											.format('YYYY-MM-DD'),
									},
								},
								attributes: ['date'],
								order: [['date', 'ASC']],
							},
						],
					},
				],
				attributes: {
					exclude: ['username', 'refresh_token', 'role', 'status'],
				},
				order: [
					[
						{
							model: Doctor,
							as: 'doctor',
						},
						{
							model: Schedule,
							as: 'schedules',
						},
						'date',
						'ASC',
					],
				],
			});
			if (count === 0) {
				return { rows: [], currentPage: 1, endPage: 1 };
			}

			const endPage = Math.ceil(count / limit);
			if (currentPage > endPage) throw new Error('Page is invalid');

			// loop through the rows to get distinct date
			rows.forEach(row => {
				const schedules = row.doctor.schedules;
				const checkDistinctDate = [];
				const distinctDateArray = [];
				schedules.forEach(schedule => {
					if (!checkDistinctDate.includes(schedule.date)) {
						checkDistinctDate.push(schedule.date);
						distinctDateArray.push(schedule);
					}
				});
				row.doctor.schedules = distinctDateArray;
			});

			return { rows, currentPage, endPage };
		}
	} catch (error) {
		console.log(error);
		throw new NotFoundError('Cannot get doctors');
	}
};

const getDoctorById = async id => {
	try {
		const doctor = await Doctor.findByPk(id, {
			attributes: ['id', 'speciality_id', 'rank', 'price', 'description'],
			include: [
				{
					model: User,
					as: 'user',
					attributes: [
						'id',
						'name',
						'email',
						'phone_number',
						'avatar',
					],
					required: false,
					subQuery: false,
				},
				{
					model: Speciality,
					as: 'speciality',
					attributes: ['name'],
					required: false,
					subQuery: false,
				},
				{
					model: Schedule,
					as: 'schedules',
					required: false,
					subQuery: false,
					where: {
						// having the date is greater than today to the next 7 days
						date: {
							[Op.gte]: moment().format('YYYY-MM-DD'),
							[Op.lte]: moment()
								.add(7, 'days')
								.format('YYYY-MM-DD'),
						},
					},
					attributes: ['date'],
					order: [['date', 'ASC']],
				},
			],
			order: [
				[
					{
						model: Schedule,
						as: 'schedules',
					},
					'date',
					'ASC',
				],
			],
		});

		if (!doctor) throw new NotFoundError('Doctor not found');

		// loop through the rows to get distinct date
		const schedules = doctor.schedules;
		const checkDistinctDate = [];
		const distinctDateArray = [];
		schedules.forEach(schedule => {
			if (!checkDistinctDate.includes(schedule.date)) {
				checkDistinctDate.push(schedule.date);
				distinctDateArray.push(schedule);
			}
		});
		doctor.schedules = distinctDateArray;

		return doctor;
	} catch (error) {
		console.log(error);
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

const getShiftsOfDoctor = async (date, doctor_id) => {
	try {
		const schedules = await Schedule.findAll({
			where: {
				doctor_id: doctor_id,
				date: date,
			},
			attributes: ['id'],
			include: [
				{
					model: Shift,
					as: 'shift',
					attributes: ['start_time', 'end_time'],
					required: false,
					subQuery: false,
					order: [['id', 'start_time']],
				},
			],
			order: [
				[
					{
						model: Shift,
						as: 'shift',
					},
					'start_time',
					'ASC',
				],
			],
		});

		if (!schedules) throw new NotFoundError('Schedule not found');

		return schedules;
	} catch (error) {
		throw new Error("Can't get shifts");
	}
};

export default {
	getAllDoctor,
	getDoctorById,
	getAllSpeciality,
	getShiftsOfDoctor,
};
