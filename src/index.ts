import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { UAV, UAVObj } from './models/UAV';
import { setup } from './utils/mqtt';
import WebSocket from 'ws';
import router from './router';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT) ?? 4000;
const socketInterval = parseInt(process.env.SOCKET_INTERVAL) ?? 10000;

app.use(express.json());
app.use('/', router);

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});

const uav: UAVObj = {
	'1': new UAV(1),
	'2': new UAV(2),
};

setup(uav);

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
	console.log(`[${new Date()}] client connected`);
	ws.send(JSON.stringify(Array.from(Object.values(uav))));

	const interval = setInterval(() => {
		ws.send(JSON.stringify(Array.from(Object.values(uav))));
	}, socketInterval);

	ws.on('close', () => {
		clearInterval(interval);
	});

	ws.on('message', msg => {
		console.log(msg);
	});
});
