import Doctor from '../../services/admin/DoctorServices';

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

export default {
	index,
};
