import { Response, Router } from 'express';
import db from '../utils/db';
import { AddVehicleSchemaType, addVehicleSchema, validateRequestSchema } from '../utils/validation';
import type { Vehicle } from '@prisma/client';
import { ExpressRequest } from '../utils/types';
import { uavs } from '../utils/uav';
import { UAV } from '../models/UAV';

const router = Router();

router.post('/add', validateRequestSchema(addVehicleSchema), async (req: ExpressRequest, res: Response) => {
	const { name, type, dataUrl, dataSourceId, videoUrl }: AddVehicleSchemaType = req.body;
	const { id } = req.user!;

	const vehicleExists = await db.vehicle.findFirst({ where: { name, userId: id } });

	if (vehicleExists) return res.status(400).json({ error: `Vehicle with the name "${name}" already exists` });

	const vehicle = await db.vehicle.create({
		data: {
			name,
			type,
			dataUrl: dataUrl ?? null,
			videoUrl: videoUrl ?? null,
			dataSourceId: dataSourceId ?? null,
			user: { connect: { id } },
		},
	});

	if (vehicle.dataSourceId) {
		uavs[vehicle.dataSourceId] = new UAV(vehicle.dataSourceId);
	}

	res.json({
		success: true,
		vehicle: (({ id, userId, createdAt, updatedAt, deletedAt, ...obj }) => obj)(vehicle),
	});
});

router.get('/list', async (req: ExpressRequest, res: Response) => {
	const { id } = req.user!;

	const vehicles = await db.vehicle.findMany({ where: { userId: id } });

	res.json({
		success: true,
		vehicles: vehicles.map(({ id, userId, createdAt, updatedAt, deletedAt, ...obj }) => obj),
	});
});

router.post('/update', async (req: ExpressRequest, res: Response) => {
	const { id, name, type, dataUrl, videoUrl }: Vehicle = req.body;
	const { id: userId } = req.user!;

	const vehicleExists = await db.vehicle.findFirst({ where: { id, userId } });

	if (!vehicleExists) return res.status(400).json({ error: `Vehicle with the id "${id}" does not exist` });

	const vehicle = await db.vehicle.update({
		where: { id },
		data: {
			name,
			type,
			dataUrl: dataUrl ?? null,
			videoUrl: videoUrl ?? null,
		},
	});

	res.json({
		success: true,
		vehicle: (({ id, userId, createdAt, updatedAt, deletedAt, ...obj }) => obj)(vehicle),
	});
});

router.post('/delete', async (req: ExpressRequest, res: Response) => {
	const { name } = req.body;
	const { id: userId } = req.user!;

	const vehicleExists = await db.vehicle.findFirst({ where: { name, userId } });

	if (!vehicleExists) return res.status(400).json({ error: `Vehicle with the name "${name}" does not exist` });

	await db.vehicle.delete({ where: { id: vehicleExists.id } });

	res.json({ success: true });
});

export default router;
