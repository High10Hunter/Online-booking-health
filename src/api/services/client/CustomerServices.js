import { Customer } from '../../models';

const createCustomer = async data => {
	try {
		const [customer, created] = await Customer.findOrCreate({
			where: {
				name: data.name,
				email: data.email,
				phone_number: data.phone_number,
			},
			defaults: data,
		});

		return customer;
	} catch (error) {
		throw new Error(error.message || 'Cannot create customer');
	}
};

export default {
	createCustomer,
};
