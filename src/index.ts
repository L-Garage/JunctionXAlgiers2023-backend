import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { UAV, UAVObj } from './models/UAV';
import { setup } from './utils/mqtt';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT) ?? 4000;

app.get('/', (req: Request, res: Response) => {
	res.send('API');
});

const server = app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});

const uav: UAVObj = {
	'1': new UAV(1),
	'2': new UAV(2),
};

setup(uav);
