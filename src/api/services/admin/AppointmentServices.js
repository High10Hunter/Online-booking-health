import { Op } from 'sequelize';
import AppointmentStatusEnum from '../../enums/AppoimentStatusEnum';
import { BadRequestError } from '../../errors';
import { Appointment, Schedule } from '../../models';

const countAppointmentByDate = async (startDate, endDate) => {
	try {
		const count = await Appointment.count({
			where: {
				'$schedule.date$': {
					[Op.between]: [startDate, endDate],
				},
				status: AppointmentStatusEnum.APPROVED,
			},
			include: [
				{
					model: Schedule,
					as: 'schedule',
					attributes: ['id'],
					required: true,
					subQuery: false,
				},
			],
		});

		return count;
	} catch (error) {
		throw new BadRequestError('Cannot get count appointment');
	}
};

const calculateTotalPriceOfAppointmentsByDate = async (startDate, endDate) => {
	try {
		const totalPrice = await Appointment.sum('price', {
			where: {
				'$schedule.date$': {
					[Op.between]: [startDate, endDate],
				},
				status: AppointmentStatusEnum.APPROVED,
			},
			include: [
				{
					model: Schedule,
					as: 'schedule',
					attributes: [],
					required: true,
					subQuery: false,
				},
			],
		});

		return totalPrice;
	} catch (error) {
		throw new BadRequestError('Cannot get count appointment');
	}
};

export default {
	countAppointmentByDate,
	calculateTotalPriceOfAppointmentsByDate,
};
