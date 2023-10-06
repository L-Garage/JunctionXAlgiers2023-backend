export const handleBat = (uavs: object, id: string, subtopic: string, message: string) => {
	const data = message.split(',');

	if (!uavs[id]) return;

	switch (subtopic) {
		case 'vl':
			uavs[id].bat.vl = parseFloat(data[0]);
			break;
		case 'pt':
			uavs[id].bat.pt = parseFloat(data[0]);
			break;
	}
};

export const handleGps = (uavs: object, id: string, subtopic: string, message: string) => {
	const data = message.split(',');

	if (!uavs[id]) return;

	switch (subtopic) {
		case 'fx':
			// data = [3]
			uavs[id].gps.fx = data[0] == '3'; // TODO
			break;
		case 'ns':
			uavs[id].gps.ns = parseInt(data[0]);
			break;
		case 'lat':
			uavs[id].gps.lat = parseFloat(data[0]);
			break;
		case 'lon':
			uavs[id].gps.lon = parseFloat(data[0]);
			break;
		case 'abs':
			uavs[id].gps.abs = parseFloat(data[0]);
			break;
		case 'rel':
			// no data
			uavs[id].gps.rel = parseFloat(data[0]); // TODO
			break;
	}
};

export const handleState = (uavs: object, id: string, subtopic: string, message: string) => {
	const data = message.split(',');

	if (!uavs[id]) return;

	switch (subtopic) {
		case 'in_air':
			uavs[id].state.in_air = data[0] === 'True';
			break;
		case 'armed':
			// data = [1] or [2]
			uavs[id].state.armed = data[0] === '1'; // TODO
			break;
		case 'state':
			uavs[id].state.state = parseInt(data[0]);
			break;
		case 'mav_msg':
			// no data
			uavs[id].state.mav_msg = data[0]; // TODO
			break;
		case 'health':
			// no data
			uavs[id].state.health = parseInt(data[0]); // TODO
			break;
		case 'fm':
			// no data
			uavs[id].state.fm = parseInt(data[0]); // TODO
			break;
	}
};
