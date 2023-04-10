import { StatusCodes } from 'http-status-codes';
import Appointment from '../../services/client/AppointmentServices';
import Customer from '../../services/client/CustomerServices';
import { sendMail } from '../../utils';
import {
	signAppointmentToken,
	verifyAppointmentToken,
} from '../../services/jwt/JwtServices';

const index = async (req, res) => {
	const { schedule_id } = req.params;

	const schedule = await Appointment.getBookedScheduleById(schedule_id);
	if (!schedule) {
		return res.redirect('/doctors');
	}

	res.render('./client/booking', {
		layout: './layouts/client_layouts/master',
		title: 'Đặt lịch khám',
		schedule,
	});
};

const store = async (req, res) => {
	const {
		name,
		birthday,
		gender,
		phone_number,
		email,
		description,
		schedule_id,
		price,
	} = req.body;

	try {
		const customer = await Customer.createCustomer({
			name,
			birthday,
			gender,
			phone_number,
			email,
		});

		const appointment = await Appointment.createAppointment({
			customer_id: customer.id,
			schedule_id,
			description,
			price,
		});

		const schedule = await Appointment.getBookedScheduleById(schedule_id);

		const token = await signAppointmentToken(
			appointment.id,
			customer.id,
			schedule_id
		);

		sendMail({
			name,
			birthday,
			phone_number,
			email,
			schedule,
			token,
		})
			.then(response => {
				console.log(response.message);
			})
			.catch(error => {
				throw new Error(error.message);
			});

		return res.status(StatusCodes.OK).json({
			message: 'Create appointment successfully',
			data: appointment,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot create appointment',
		});
	}
};

const confirm = async (req, res) => {
	const { token } = req.params;

	if (!token) {
		return res.send('Token is required');
	}

	try {
		const decoded = await verifyAppointmentToken(token);
		await Appointment.confirmAppointment(
			decoded.appointment_id,
			decoded.customer_id
		);

		res.render('./client/confirm_appointment', {
			layout: './client/confirm_appointment',
			title: 'Xác nhận lịch khám',
		});
	} catch (error) {
		res.render('./client/error_appointment', {
			layout: './client/error_appointment',
			title: 'Không thể xác nhận đơn khám',
			message:
				'Đơn khám này đã được xác nhận hoặc không tồn tại, bạn không thể xác nhận đơn khám này',
		});
	}
};

const cancel = async (req, res) => {
	const { token } = req.params;

	try {
		const decoded = await verifyAppointmentToken(token);
		await Appointment.cancelAppointment(
			decoded.appointment_id,
			decoded.customer_id
		);

		res.render('./client/cancel_appointment', {
			layout: './client/cancel_appointment',
			title: 'Hủy lịch khám',
		});
	} catch (error) {
		res.render('./client/error_appointment', {
			layout: './client/error_appointment',
			title: 'Không thể huỷ đơn khám',
			message:
				'Đơn khám này đã được hoàn tất hoặc không tồn tại, bạn không thể huỷ đơn khám này',
		});
	}
};

export default {
	index,
	store,
	confirm,
	cancel,
};
