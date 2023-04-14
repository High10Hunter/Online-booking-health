import { Shift } from '../../models';
import { NotFoundError } from '../../errors';
import NodeCache from 'node-cache';

const myCache = new NodeCache();

const getAllShifts = async () => {
	try {
		let shiftsInCache = myCache.get('shifts');

		if (shiftsInCache == undefined) {
			const shifts = await Shift.findAll({
				attributes: ['id', 'start_time', 'end_time'],
			});

			shiftsInCache = [];
			shifts.forEach(shift => {
				shiftsInCache.push({
					id: shift.id,
					start_time: shift.start_time,
					end_time: shift.end_time,
				});
			});

			myCache.set('shifts', shiftsInCache, 86400);
		}

		return shiftsInCache;
	} catch (error) {
		throw new Error("Can't get shifts");
	}
};

export default {
	getAllShifts,
};
