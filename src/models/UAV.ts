export class UAV {
	id: number;
	bat: {
		id: number;
		vl: number;
		pt: number;
	};
	gps: {
		fx: boolean;
		ns: number;
		lat: number;
		lon: number;
		abs: number;
		rel: number;
	};
	state: {
		in_air: boolean;
		armed: boolean;
		state: number;
		mav_msg: string;
		health: number;
		fm: number;
	};

	constructor(id: number) {
		this.id = id;
		this.bat = { id: 0, vl: 0, pt: 0 };
		this.gps = { fx: false, ns: 0, lat: 0, lon: 0, abs: 0, rel: 0 };
		this.state = { in_air: false, armed: false, state: 0, mav_msg: '', health: 0, fm: 0 };
	}
}
