import {
	User,
	Doctor,
	Speciality,
	Schedule,
	Shift,
	Appointment,
	sequelize,
} from '../../models';
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

		const startIndex = (currentPage - 1) * limit;
		const endIndex = startIndex + limit;

		if (speciality_id) {
			let rows = await User.findAll({
				where: {
					name: {
						[Op.iLike]: `%${q}%`,
					},
					status: true,
					role: 3,
					'$doctor.speciality_id$': speciality_id,
					// schedule is not booked
					[Op.not]: [
						sequelize.literal(
							'exists (select * from "appointments" where "doctor->schedules"."id" = "doctor->schedules->appointments"."schedule_id")'
						),
					],
				},
				required: true,
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
						required: true,
						subQuery: false,
						include: [
							{
								model: Schedule,
								as: 'schedules',
								required: true,
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
								include: [
									{
										model: Appointment,
										as: 'appointments',
										required: false,
										subQuery: false,
										attributes: ['schedule_id'],
									},
								],
								attributes: ['date'],
								order: [['date', 'ASC']],
							},
							{
								model: Speciality,
								as: 'speciality',
								attributes: ['name'],
								required: true,
								subQuery: false,
							},
						],
					},
				],
				attributes: {
					exclude: [
						'username',
						'password',
						'refresh_token',
						'role',
						'status',
					],
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

			const count = rows.length;

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

			rows = rows.slice(startIndex, endIndex);
			return { rows, currentPage, endPage };
		} else {
			let rows = await User.findAll({
				where: {
					name: {
						[Op.iLike]: `%${q}%`,
					},
					status: true,
					role: 3,
					// schedule is not booked
					[Op.not]: [
						sequelize.literal(
							'exists (select * from "appointments" where "doctor->schedules"."id" = "doctor->schedules->appointments"."schedule_id")'
						),
					],
				},
				required: true,
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
						required: true,
						subQuery: false,
						include: [
							{
								model: Schedule,
								as: 'schedules',
								required: true,
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
								include: [
									{
										model: Appointment,
										as: 'appointments',
										required: false,
										subQuery: false,
										attributes: ['schedule_id'],
									},
								],
								attributes: ['date'],
								order: [['date', 'ASC']],
							},
							{
								model: Speciality,
								as: 'speciality',
								attributes: ['name'],
								required: true,
								subQuery: false,
							},
						],
					},
				],
				attributes: {
					exclude: [
						'username',
						'password',
						'refresh_token',
						'role',
						'status',
					],
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

			const count = rows.length;

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

			rows = rows.slice(startIndex, endIndex);
			return { rows, currentPage, endPage };
		}
	} catch (error) {
		console.log(error.message);
		throw new NotFoundError('Cannot get doctors');
	}
};

const getDoctorsForHomePage = async () => {
	try {
		let rows = await User.findAll({
			where: {
				status: true,
				role: 3,
			},
			required: true,
			include: [
				{
					model: Doctor,
					as: 'doctor',
					attributes: ['id', 'speciality_id', 'rank', 'description'],
					required: true,
					subQuery: false,
					include: [
						{
							model: Schedule,
							as: 'schedules',
							required: true,
							subQuery: false,
							include: [
								{
									model: Appointment,
									as: 'appointments',
									required: false,
									subQuery: false,
									attributes: ['schedule_id'],
								},
							],
							attributes: ['date'],
						},
						{
							model: Speciality,
							as: 'speciality',
							attributes: ['name'],
							required: true,
							subQuery: false,
						},
					],
				},
			],
			attributes: {
				exclude: [
					'username',
					'password',
					'refresh_token',
					'role',
					'status',
					'phone_number',
					'email',
					'gender',
				],
			},
		});

		return rows;
	} catch (error) {
		console.log(error.message);
		throw new NotFoundError('Cannot get doctors');
	}
};

const getFreeDoctorsByDateAndShift = async (
	date,
	shift_id,
	currentPage = 1
) => {
	try {
		const limit = 5;

		if (currentPage < 0 || limit <= 0)
			throw new Error('Page or limit is invalid');

		const startIndex = (currentPage - 1) * limit;
		const endIndex = startIndex + limit;

		let rows = [];
		if (date && shift_id) {
			// check if the date is current date or not
			const currentDate = moment().format('YYYY-MM-DD');
			if (date < currentDate) throw new Error('Date is invalid');

			if (date == currentDate) {
				rows = await Doctor.findAll({
					where: {
						[Op.not]: [
							sequelize.literal(
								`exists (
										select 
											* 
										from "appointments" 
										where 
											"schedules->appointments"."schedule_id" 
											in (
												select 
													"id" 
												from "schedules" 
												where "doctor_id" = "Doctor"."id" 
												and "shift_id" = ${shift_id}
												and "date" = '${date}' 
												)
											)`
							),
						],
						'$schedules.shift_id$': shift_id,
						'$schedules.date$': date,
						// current time plus 1 hour is greater than the start time of the shift
						[Op.eq]: sequelize.literal(
							`"schedules->shift"."start_time" >= '${moment()
								.add(1, 'hours')
								.format('HH:mm:ss')}'`
						),
					},
					attributes: ['id', 'rank', 'price', 'description'],
					include: [
						{
							model: Schedule,
							as: 'schedules',
							required: true,
							subQuery: false,
							include: [
								{
									model: Appointment,
									as: 'appointments',
									required: false,
									subQuery: false,
									attributes: ['schedule_id'],
								},
								{
									model: Shift,
									as: 'shift',
									attributes: ['start_time', 'end_time'],
									required: true,
									subQuery: false,
								},
							],
							attributes: ['id', 'date'],
						},
						{
							model: User,
							as: 'user',
							attributes: ['name', 'avatar'],
							required: true,
							subQuery: false,
						},
						{
							model: Speciality,
							as: 'speciality',
							attributes: ['name'],
							required: true,
							subQuery: false,
						},
					],
				});
			} else {
				rows = await Doctor.findAll({
					where: {
						[Op.not]: [
							sequelize.literal(
								`exists (
										select 
											* 
										from "appointments" 
										where 
											"schedules->appointments"."schedule_id" 
											in (
												select 
													"id" 
												from "schedules" 
												where "doctor_id" = "Doctor"."id" 
												and "shift_id" = ${shift_id}
												and "date" = '${date}' 
												)
											)`
							),
						],
						'$schedules.shift_id$': shift_id,
						'$schedules.date$': date,
					},
					attributes: ['id', 'rank', 'price', 'description'],
					include: [
						{
							model: Schedule,
							as: 'schedules',
							required: true,
							subQuery: false,
							include: [
								{
									model: Appointment,
									as: 'appointments',
									required: false,
									subQuery: false,
									attributes: ['schedule_id'],
								},
								{
									model: Shift,
									as: 'shift',
									attributes: ['start_time', 'end_time'],
									required: true,
									subQuery: false,
								},
							],
							attributes: ['id', 'date'],
						},
						{
							model: User,
							as: 'user',
							attributes: ['name', 'avatar'],
							required: true,
							subQuery: false,
						},
						{
							model: Speciality,
							as: 'speciality',
							attributes: ['name'],
							required: true,
							subQuery: false,
						},
					],
				});
			}
		}

		const count = rows.length;

		if (count === 0) {
			return { rows: [], currentPage: 1, endPage: 1 };
		}

		const endPage = Math.ceil(count / limit);
		if (currentPage > endPage) throw new Error('Page is invalid');

		rows = rows.slice(startIndex, endIndex);
		return { rows, currentPage, endPage };
	} catch (error) {
		console.log(error.message);
		throw new NotFoundError(error.message || 'Cannot get doctors');
	}
};

const getDoctorById = async id => {
	try {
		const doctor = await Doctor.findByPk(id, {
			where: {
				[Op.not]: [
					sequelize.literal(
						'exists (select * from "appointments" where "doctor->schedules"."id" = "doctor->schedules->appointments"."schedule_id")'
					),
				],
			},
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
					include: [
						{
							model: Appointment,
							as: 'appointments',
							required: false,
							subQuery: false,
							attributes: ['schedule_id'],
						},
					],
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
				attributes: ['id', 'name', 'image'],
			});

			specialitiesInCache = [];
			specialities.forEach(speciality => {
				specialitiesInCache.push({
					id: speciality.id,
					name: speciality.name,
					image: speciality.image,
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
				[Op.not]: [
					sequelize.literal(
						'exists (select * from "appointments" where "appointments"."schedule_id" = "Schedule"."id")'
					),
				],
			},
			attributes: ['id'],
			include: [
				{
					model: Appointment,
					as: 'appointments',
					required: false,
					subQuery: false,
					attributes: ['schedule_id'],
				},
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
		console.log(error.message);
		throw new Error("Can't get shifts");
	}
};

export default {
	getAllDoctor,
	getDoctorById,
	getAllSpeciality,
	getShiftsOfDoctor,
	getFreeDoctorsByDateAndShift,
	getDoctorsForHomePage,
};
