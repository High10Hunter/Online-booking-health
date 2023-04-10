import Doctor from '../../services/client/DoctorServices';

const index = async (req, res) => {
	try {
		const { q, page, speciality_id } = req.query;

		const { rows, currentPage, endPage } = await Doctor.getAllDoctor(
			q,
			page,
			speciality_id
		);

		// const specialities = await Doctor.getAllSpeciality();

		return res.render('./client/doctor_list', {
			layout: './layouts/client_layouts/master',
			users: rows,
			pages: endPage,
			current: currentPage,
			search: q,
			// specialities: specialities,
			selectedSpeciality: speciality_id,
		});
	} catch (error) {
		return res.redirect('/');
	}
};

const show = async (req, res) => {
	try {
		const { date, doctor_id } = req.query;

		if (!date || !doctor_id) {
			return res.redirect('/doctors');
		}

		const doctor = await Doctor.getDoctorById(doctor_id);
		const shifts = await Doctor.getShiftsOfDoctor(date, doctor_id);

		if (!doctor || !shifts) {
			return res.redirect(
				`/doctor_profile?date=${date}&doctor_id=${doctor_id}`
			);
		}

		return res.render('./client/doctor_profile', {
			layout: './layouts/client_layouts/master',
			doctor: doctor,
			shifts: shifts,
			selectedDate: date,
		});
	} catch (error) {
		console.log(error);
		return res.redirect('/doctors');
	}
};

export default {
	index,
	show,
};
