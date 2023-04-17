import { Doctor, Speciality } from '../../models';
import { NotFoundError } from '../../errors';

const getDoctorByUserId = async userId => {
	try {
		const doctor = await Doctor.findOne({
			where: {
				user_id: userId,
			},
			attributes: ['id', 'speciality_id', 'rank'],
			include: [
				{
					model: Speciality,
					as: 'speciality',
					attributes: ['name'],
					subQuery: false,
				},
			],
		});

		if (!doctor) throw new NotFoundError('Doctor not found');

		return doctor;
	} catch (error) {
		throw new NotFoundError('Cannot get doctor');
	}
};

export default {
	getDoctorByUserId,
};
