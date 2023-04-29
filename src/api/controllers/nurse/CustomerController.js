import { StatusCodes } from 'http-status-codes';
import Customer from '../../services/nurses/CustomerServices';

const index = async (req, res) => {
	try {
		const { q, page, status } = req.query;
		const { rows, currentPage, endPage } = await Customer.getAllCustomers(
			q,
			page,
			status
		);
		
		return res.render('./nurse/customers/index', {
			customers: rows,
			pages: endPage,
			current: currentPage,
			search: q,
			badStatus: status,
			layout: './layouts/nurse_layout/master',
			title: 'Quản lý khách hàng',
		});
	} catch (error) {
		return res.redirect('/nurse/customers?page=1');
	}
};

const getCustomer = async (req, res) => {
	try {
		const customer = await Customer.getCustomerById(req.params.id);
		const appointment = await Customer.getAppointmentOfCustomer(req.params.id);
		const data = {
			customer,
			appointment,
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
