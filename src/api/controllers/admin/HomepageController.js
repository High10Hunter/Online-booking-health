import moment from 'moment';
import Appointment from '../../services/admin/AppointmentServices';
import { StatusCodes } from 'http-status-codes';
import Schedule from '../../services/admin/ScheduleServices';

const index = async (req, res) => {
	try {
		const todayAppointments = await Appointment.countAppointmentByDate(
			moment().startOf('day').toDate(),
			moment().endOf('day').toDate()
		);

		const lastMonthAppointments = await Appointment.countAppointmentByDate(
			moment().subtract(1, 'month').startOf('month').toDate(),
			moment().subtract(1, 'month').endOf('month').toDate()
		);

		const totalRevenueLastMonth =
			await Appointment.calculateTotalPriceOfAppointmentsByDate(
				moment().subtract(1, 'month').startOf('month').toDate(),
				moment().subtract(1, 'month').endOf('month').toDate()
			);

		const totalRevenueThisMonth =
			await Appointment.calculateTotalPriceOfAppointmentsByDate(
				moment().startOf('month').toDate(),
				moment().endOf('month').toDate()
			);

		// calculate difference percent between this month and last month revenue
		const differencePercent =
			Math.round(
				((totalRevenueThisMonth - totalRevenueLastMonth) /
					totalRevenueLastMonth) *
					100
			) / 100;

		res.render('admin/index', {
			title: 'Quản lý phòng khám',
			todayAppointments,
			lastMonthAppointments,
			totalRevenueThisMonth,
			differencePercent,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get count appointment',
		});
	}
};

export default { index };
