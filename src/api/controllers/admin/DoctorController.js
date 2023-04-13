import { StatusCodes } from 'http-status-codes';
import Doctor from '../../services/admin/DoctorServices';
import RolesEnum from '../../enums/RolesEnum';

const index = async (req, res) => {
	try {
		const { q, page, speciality_id } = req.query;

		const { rows, currentPage, endPage } = await Doctor.getAllDoctor(
			q,
			page,
			speciality_id
		);

		const specialities = await Doctor.getAllSpeciality();

		return res.render('./admin/schedules/index', {
			users: rows,
			pages: endPage,
			current: currentPage,
			search: q,
			specialities: specialities,
			selectedSpeciality: speciality_id,
			title: 'Phân lịch khám',
		});
	} catch (error) {
		return res.redirect('/admin/schedules?page=1');
	}
};

const getDoctor = async (req, res) => {
	try {
		const doctor = await Doctor.getDoctorById(req.params.id);

		const specialities = await Doctor.getAllSpeciality();

		return res.render('./admin/doctors/update', {
			doctor: doctor,
			specialities: specialities,
			title: 'Cập nhật thông tin bác sĩ',
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot create user',
			data: [],
		});
	}
};

const update = async (req, res) => {
	try {
		const doctor = await Doctor.updateDoctor(req.params.id, req.body);
		return res.status(StatusCodes.OK).json({
			message: 'Update doctor successfully',
			data: doctor,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot update doctor',
			data: [],
		});
	}
};

export default {
	index,
	getDoctor,
	update,
};
