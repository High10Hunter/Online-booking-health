import Doctor from '../../services/client/DoctorServices';

const homepage = async (req, res) => {
	const specialities = await Doctor.getAllSpeciality();

	return res.render('./client/index', {
		layout: './layouts/client_layouts/master',
		specialities,
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

		return res.render('./client/doctor_list', {
			layout: './layouts/client_layouts/master',
			users: rows,
			pages: endPage,
			current: currentPage,
			search: q,
			specialities,
			selectedSpeciality: speciality_id,
		});
	} catch (error) {
		return res.redirect('/');
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

		return res.render('./client/doctor_profile', {
			layout: './layouts/client_layouts/master',
			doctor,
			shifts,
			specialities,
			selectedDate: date,
		});
	} catch (error) {
		return res.redirect('/doctors');
	}
};

export default {
	homepage,
	index,
	show,
};
