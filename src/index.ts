import express from 'express';
import dotenv from 'dotenv';
import { setupUAV } from './utils/mqtt';
import WebSocket from 'ws';
import router from './router';
import { verifyToken } from './utils/jwt';
import db from './utils/db';
import { getUAV, uavs } from './utils/uav';
import { User, Vehicle } from '@prisma/client';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT!) ?? 4000;
const socketInterval = parseInt(process.env.SOCKET_INTERVAL!) ?? 10000;

app.use(express.json());
app.use('/', router);

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

const sendUAVData = async (ws: WebSocket, userId: User['id']) => {
	const vehicles = await db.vehicle.findMany({ where: { userId } });
	const vehicleIds = vehicles.map(vehicle => vehicle.dataSourceId).filter(e => !!e) as number[];
	const data = vehicleIds.map(id => getUAV(id!));
	ws.send(JSON.stringify(data));
};

wss.on('connection', ws => {
	let interval: NodeJS.Timeout | null = null;

	ws.on('close', () => {
		!!interval && clearInterval(interval);
	});

	ws.on('message', async msg => {
		if (msg.toString().startsWith('connect:')) {
			const token = msg.toString().replace('connect:', '');
			try {
				const payload = verifyToken(token);

				const user = await db.user.findUnique({
					where: { id: payload.id },
					include: { vehicles: true },
				});

				if (!user) return;

				interval = setInterval(() => sendUAVData(ws, user.id), socketInterval);
			} catch (error) {
				//
			}
		}
	});
});
