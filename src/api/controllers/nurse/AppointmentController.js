import { StatusCodes } from 'http-status-codes';
import Appointment from '../../services/nurses/AppointmentServices';
import moment from 'moment';

const index = async (req, res) => {
	try {
		const { q, page, status } = req.query;
		const { rows, currentPage, endPage } =
			await Appointment.getAllAppointments(q, page, status);

		const todayAppointments = await Appointment.countAppointmentByDate(
			moment().startOf('day').toDate(),
			moment().endOf('day').toDate()
		);

		const currentMonthAppointments =
			await Appointment.countAppointmentByDate(
				moment().startOf('month').toDate(),
				moment().endOf('month').toDate()
			);

		const pendingAppointments = await Appointment.countPendingAppointment();

		const todayCompletedAppointments =
			await Appointment.countAppointmentByDateAndStatus(
				moment().startOf('day').toDate(),
				moment().endOf('day').toDate(),
				5
			);

		return res.render('./nurse/index', {
			todayAppointments,
			pendingAppointments,
			todayCompletedAppointments,
			currentMonthAppointments,
			appointments: rows,
			user: req.payload,
			pages: endPage,
			current: currentPage,
			search: q,
			selectedStatus: status,
			layout: './layouts/nurse_layout/master',
			title: 'Quản lý đơn đặt khám',
		});
	} catch (error) {
		return res.redirect('/nurse/appointments?page=1');
	}
};

const updateStatus = async (req, res) => {
	try {
		const appointment = await Appointment.updateStatusAppointment(
			req.params.id,
			req.body
		);

		return res.status(StatusCodes.OK).json({
			message: 'Update status appointment successfully',
			data: appointment,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot update status appointment',
			data: [],
		});
	}
};

const getAppointment = async (req, res) => {
	try {
		const appointment = await Appointment.getAppointmentById(req.params.id);
		const date = appointment.schedule.date;
		let dayOfWeek = moment(date, 'YYYY-MM-DD').format('d');
		const daysOfWeek = [
			'Chủ nhật',
			'Thứ hai',
			'Thứ ba',
			'Thứ tư',
			'Thứ năm',
			'Thứ sáu',
			'Thứ bảy',
		];

		const expired = moment(
			date + ' ' + appointment.schedule.shift.end_time
		).isBefore(moment().format('YYYY-MM-DD HH:mm:ss'));

		const data = {
			appointment,
			doctor_rank: appointment.schedule.doctor.getRankName(),
			appointment_day: daysOfWeek[dayOfWeek],
			expired,
		};

		return res.status(StatusCodes.OK).json({
			message: 'Get appointment successfully',
			data: data,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get appointment',
			data: [],
		});
	}
};

const update = async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const { appointment } = req.body;
		const user_id = req.payload.id;
		const updatedAppointment = await Appointment.updateAppointment(
			appointmentId,
			appointment,
			user_id
		);
		return res.status(StatusCodes.OK).json({
			message: 'Update appointment successfully',
			data: updatedAppointment,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot update appointment',
			data: [],
		});
	}
};

const getStatistic = async (req, res) => {
	try {
		const todayAppointments = await Appointment.countAppointmentByDate(
			moment().startOf('day').toDate(),
			moment().endOf('day').toDate()
		);

		const currentMonthAppointments =
			await Appointment.countAppointmentByDate(
				moment().startOf('month').toDate(),
				moment().endOf('month').toDate()
			);

		const pendingAppointments = await Appointment.countPendingAppointment();

		const todayCompletedAppointments =
			await Appointment.countAppointmentByDateAndStatus(
				moment().startOf('day').toDate(),
				moment().endOf('day').toDate(),
				5
			);

		const data = {
			todayAppointments,
			currentMonthAppointments,
			pendingAppointments,
			todayCompletedAppointments,
		};

		return res.status(StatusCodes.OK).json({
			message: 'Get statistic successfully',
			data: data,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get statistic',
			data: [],
		});
	}
};

export default {
	index,
	updateStatus,
	getAppointment,
	update,
	getStatistic,
};
