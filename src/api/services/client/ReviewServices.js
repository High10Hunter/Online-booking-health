import AppointmentStatusEnum from '../../enums/AppoimentStatusEnum';
import { BadRequestError } from '../../errors';
import { Appointment, Schedule, Review, Customer } from '../../models';


const getReviewsOfDoctor = async doctor_id => {
	try {
		const reviews = await Review.findAll({
			where: {
				doctor_id: doctor_id,
			},
			attributes: ['name', 'comment', 'createdAt'],
			order: [['createdAt', 'DESC']],
		});
		return reviews;
	} catch (error) {
		throw new BadRequestError('Cannot get reviews');
	}
};

const createReview = async (data) => {
	try {
		const customer = await Customer.findOne({
			where: {
				phone_number: data.phone_number,
				email: data.email
			},
			attributes: ['id'],
		});
		if(!customer){ throw new NotFoundError('Customer not found');}

		const count = await Appointment.count({
			where: {
				customer_id: customer.id,
				status: AppointmentStatusEnum.COMPLETED,
				'$schedule.doctor_id$': data.doctor_id,
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
		if (count === 0) throw new NotFoundError('Appointment not found');
		console.log('data', data);
		const review = await Review.create({
			...data,
		});
		return review;
	} catch (error) {
		throw new BadRequestError('Cannot create review');
	}
}

export default {
	getReviewsOfDoctor,
	createReview,
};
