import type { UAVObj } from '../models/UAV';

export const handleBat = (uav: UAVObj, id: number, subtopic: string, message: string) => {
	const data = message.split(',');

	switch (subtopic) {
		case 'vl':
			uav[id].bat.vl = parseFloat(data[0]);
			break;
		case 'pt':
			uav[id].bat.pt = parseFloat(data[0]);
			break;
	}
};

export const handleGps = (uav: UAVObj, id: number, subtopic: string, message: string) => {
	const data = message.split(',');

	switch (subtopic) {
		case 'fx':
			// data = [3]
			uav[id].gps.fx = data[0]; // TODO
			break;
		case 'ns':
			uav[id].gps.ns = parseInt(data[0]);
			break;
		case 'lat':
			uav[id].gps.lat = parseFloat(data[0]);
			break;
		case 'lon':
			uav[id].gps.lon = parseFloat(data[0]);
			break;
		case 'abs':
			uav[id].gps.abs = parseFloat(data[0]);
			break;
		case 'rel':
			// no data
			uav[id].gps.rel = parseFloat(data[0]); // TODO
			break;
	}
};

export const handleState = (uav: UAVObj, id: number, subtopic: string, message: string) => {
	const data = message.split(',');

	switch (subtopic) {
		case 'in_air':
			uav[id].state.in_air = data[0] === 'True';
			break;
		case 'armed':
			// data = [1] or [2]
			uav[id].state.armed = data[0] === '1'; // TODO
			break;
		case 'state':
			uav[id].state.state = parseInt(data[0]);
			break;
		case 'mav_msg':
			// no data
			uav[id].state.mav_msg = data[0]; // TODO
			break;
		case 'health':
			// no data
			uav[id].state.health = parseInt(data[0]); // TODO
			break;
		case 'fm':
			// no data
			uav[id].state.fm = parseInt(data[0]); // TODO
			break;
	}
};
