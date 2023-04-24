import { StatusCodes } from 'http-status-codes';
import Appointment from '../../services/nurses/AppointmentServices';
import AppointmentServices from '../../services/admin/AppointmentServices';
import moment from 'moment';

const homepage = async (req, res) => {

	return res.render('./nurse/index', {
		layout: './layouts/nurse_layout/master',
	});
};

const index = async (req, res) => {
	try {
		const { q, page, status } = req.query;
		const { rows, currentPage, endPage } = await Appointment.getAllAppointment(
			q,
			page,
			status
		);
		
		return res.render('./nurse/appointments/index', {
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
		console.log("check", req.params.id);
		console.log("check data  ", req.body);
		const appointment = await Appointment.updateStatusAppointment(req.params.id, req.body);

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
		const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu','Thứ bảy'];

		const data = {
			appointment,
			doctor_rank: appointment.schedule.doctor.getRankName(),
			appointment_day: daysOfWeek[dayOfWeek],
		}
		//console.log(data);
		return res.status(StatusCodes.OK).json({
			message: 'Get appointment successfully',
			data: data,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get appointment',
			appointment: null,
		});
	}
};

const update = async (req, res) => {
	try {
		const appointmentId = req.params.id;
		const { appointment } = req.body;
		const user_id = req.payload.id;
		console.log(appointmentId,appointment, user_id);
		const updatedAppointment = await Appointment.updateAppointment(appointmentId, appointment, user_id);
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

export default {
	homepage,
	index,
	updateStatus,
	getAppointment,
    update,
};
