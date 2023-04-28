import { StatusCodes } from 'http-status-codes';
import Customer from '../../services/nurses/CustomerServices';

const index = async (req, res) => {
	try {
		const { q, page, badStatus } = req.query;
		const { rows, currentPage, endPage } = await Customer.getAllCustomers(
			q,
			page,
			badStatus
		);
		
		return res.render('./nurse/customers/index', {
			customers: rows,
			pages: endPage,
			current: currentPage,
			search: q,
			badStatus: badStatus,
			layout: './layouts/nurse_layout/master',
			title: 'Quản lý khách hàng',
		});
		// return res.status(StatusCodes.OK).json({
		// 	message: 'get customers',
		// 	data: rows,
		// });
	} catch (error) {
		// return res.redirect('/nurse/customers?page=1');
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get customers',
			data: [],
		});
	}
};

const getCustomer = async (req, res) => {
	try {
		const customer = await Customer.getCustomerById(req.params.id);
		const appointment = await Customer.getAppointmentOfCustomer(req.params.id);
		// const date = appointment.schedule.date;
		// let dayOfWeek = moment(date, 'YYYY-MM-DD').format('d');
		// const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu','Thứ bảy'];

		const data = {
			customer,
			appointment,
			// doctor_rank: appointment.schedule.doctor.getRankName(),
			// appointment_day: daysOfWeek[dayOfWeek],
		}
		console.log(data);
		return res.status(StatusCodes.OK).json({
			message: 'Get customer successfully',
			data: data,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get customer',
			data: [],
		});
	}
};

const update = async (req, res) => {
	try {
		console.log(req.params.id, req.body);
		const updatedCustomer = await Customer.updateCustomer(req.params.id, req.body);
		return res.status(StatusCodes.OK).json({
			message: 'Update customer successfully',
			data: updatedCustomer,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot update customer',
			data: [],
		});
	}
};

export default {
	index,
	getCustomer,
	update,
};
