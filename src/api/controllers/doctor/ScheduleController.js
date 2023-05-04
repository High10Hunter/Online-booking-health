import { StatusCodes } from 'http-status-codes';
import Doctor from '../../services/doctors/DoctorServices';
import ScheduleServices from '../../services/admin/ScheduleServices';
import moment from 'moment';

const index = async (req, res) => {
	try {
		const { id, name } = req.payload;
		const doctor = await Doctor.getDoctorByUserId(id);

		res.render('doctor/index', {
			layout: 'layouts/doctor_layout/master',
			title: 'Xem lịch khám',
			doctor: {
				...doctor,
				rank_name: doctor.getRankName(),
				speciality_name: doctor.speciality.name,
				name,
			},
		});
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get schedule of doctor',
		});
	}
};

const getSchedulesOfDoctor = async (req, res) => {
	try {
		const doctor = await Doctor.getDoctorByUserId(req.payload.id);
		const doctorId = doctor.id;
		const schedules = await ScheduleServices.getScheduleOfDoctor(doctorId);

		//convert schedule to array of object
		const data = [];
		for (let i = 0; i < schedules.length; i++) {
			data.push({
				id: schedules[i].id,
				title: 'Lịch khám',
				start: schedules[i].start_time,
				end: schedules[i].end_time,
				//check whether date is in the past
				color: moment(schedules[i].start_time).isBefore(moment())
					? '#f84e4e'
					: '#2890f6',
				extendedProps: {
					startTime: schedules[i].start_time
						.split('T')[1]
						.slice(0, 5),
					endTime: schedules[i].end_time.split('T')[1].slice(0, 5),
				},
			});
		}

		return res.send(data);
	} catch (error) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			message: error.message || 'Cannot get schedule of doctor',
			schedules: [],
		});
	}
};

export default {
	index,
	getSchedulesOfDoctor,
};
