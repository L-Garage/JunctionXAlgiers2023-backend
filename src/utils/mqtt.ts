import { connect } from 'mqtt';
import { handleBat, handleGps, handleState } from './handlers';
import { UAV } from '../models/UAV';
import db from './db';

export const setupUAV = async (uavs: object) => {
	const vehicles = await db.vehicle.findMany({});

	vehicles.forEach(vehicle => {
		if (!vehicle.dataUrl || !vehicle.dataSourceId) return;

		uavs[vehicle.dataSourceId] = new UAV(vehicle.dataSourceId);

		const client = connect(vehicle.dataUrl);

		client.on('connect', () => {
			client.subscribe('#');
		});

		client.on('message', (topic, message) => {
			const t = topic.replace(/uav\d\//, '');
			const dataSourceId = topic.replace(/uav(\d)\/.*/, '$1');
			const subtopic = t.replace(/(gps|bat)\//, '');

			if (t.startsWith('bat')) {
				return handleBat(uavs, dataSourceId, subtopic, message.toString());
			}

			if (t.startsWith('gps')) {
				handleGps(uavs, dataSourceId, subtopic, message.toString());
				// client.end();
				return;
			}

			return handleState(uavs, dataSourceId, subtopic, message.toString());
		});
	});
};
