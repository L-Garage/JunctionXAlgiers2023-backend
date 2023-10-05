import { connect } from 'mqtt';
import { handleBat, handleGps, handleState } from './handlers';
import { UAVObj } from '../models/UAV';

export const setup = (uav: UAVObj) => {
	const client = connect('mqtt://13.38.173.241:1883');

	client.on('connect', () => {
		client.subscribe('#');
	});

	client.on('message', (topic, message) => {
		const t = topic.replace(/uav\d\//, '');
		const id = topic.replace(/uav(\d)\/.*/, '$1');
		const subtopic = t.replace(/(gps|bat)\//, '');

		if (t.startsWith('bat')) {
			return handleBat(uav, parseInt(id), subtopic, message.toString());
		}

		if (t.startsWith('gps')) {
			handleGps(uav, parseInt(id), subtopic, message.toString());
			// client.end();
			return;
		}

		return handleState(uav, parseInt(id), subtopic, message.toString());
	});
};
