import Doctor from '../../services/client/DoctorServices';
import Shift from '../../services/client/ShiftServices';
import Review from '../../services/client/ReviewServices';
import { getDatesRange } from '../../utils';
import { StatusCodes } from 'http-status-codes';

const homepage = async (req, res) => {
	const specialities = await Doctor.getAllSpeciality();
	const users = await Doctor.getDoctorsForHomePage();

	return res.render('./client/index', {
		layout: './layouts/client_layouts/master',
		specialities,
		users,
	});
};

const index = async (req, res) => {
	try {
		const { q, page, speciality_id } = req.query;

		const { rows, currentPage, endPage } = await Doctor.getAllDoctor(
			q,
			page,
			speciality_id
		);

		const specialities = await Doctor.getAllSpeciality();
		let selectedSpecialityName = '';
		if (speciality_id) {
			selectedSpecialityName = specialities.find(
				speciality => speciality.id == speciality_id
			).name;
		}

		return res.render('./client/doctor_list', {
			layout: './layouts/client_layouts/master',
			users: rows,
			pages: endPage,
			current: currentPage,
			search: q,
			specialities,
			selectedSpeciality: speciality_id,
			selectedSpecialityName,
		});
	} catch (error) {
		return res.redirect('/');
	}
};

const displayFreeDoctor = async (req, res) => {
	try {
		const { date, shift_id } = req.query;

		const { rows, currentPage, endPage } =
			await Doctor.getFreeDoctorsByDateAndShift(date, shift_id);

		const specialities = await Doctor.getAllSpeciality();
		const shifts = await Shift.getAllShifts();
		const dates = await getDatesRange();

		return res.render('./client/free_doctor_list', {
			layout: './layouts/client_layouts/master',
			doctors: rows,
			pages: endPage,
			current: currentPage,
			specialities,
			selectedDate: date,
			selectedShift: shift_id,
			shifts,
			dates,
		});
	} catch (error) {
		return res.redirect('/free-doctors');
	}
};

const show = async (req, res) => {
	try {
		const { date, doctor_id } = req.query;

		const doctor = await Doctor.getDoctorById(doctor_id);
		if (!date) {
			return res.redirect('/doctors');
		}
		const shifts = await Doctor.getShiftsOfDoctor(date, doctor_id);

		if (!doctor) {
			return res.redirect('/doctors');
		}

		const specialities = await Doctor.getAllSpeciality();

		const reviews = await Review.getReviewsOfDoctor(doctor_id);
		
		return res.render('./client/doctor_profile', {
			layout: './layouts/client_layouts/master',
			doctor,
			shifts,
			specialities,
			reviews,
			selectedDate: date,
		});
	} catch (error) {
		return res.redirect('/doctors');
	}
};

const storeReview = async (req, res) => {
	try {
		const review = await Review.createReview(req.body);

		return res.status(StatusCodes.OK).json({
			message: 'Create review successfully',
			data: review,
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot create review, customer not found or appointment not found',
			data: [],
		});
	}
}



export default {
	homepage,
	displayFreeDoctor,
	index,
	show,
	storeReview,
};
