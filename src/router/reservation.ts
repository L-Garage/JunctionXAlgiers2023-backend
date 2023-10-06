import { Response, Router } from 'express';
import { AddReservationSchemaType, addReservationSchema, validateRequestSchema } from '../utils/validation';
import { ExpressRequest } from '../utils/types';
import db from '../utils/db';

const router = Router();

const boundsToString = (bounds: AddReservationSchemaType['bounds']) => `[${bounds.ne.lat},${bounds.ne.lng}],[${bounds.sw.lat},${bounds.sw.lng}]`;
const stringToBounds = (bounds: string) => {
	const [ne, sw] = bounds.split('],[');
	return {
		ne: { lat: Number(ne.split(',')[0].replace('[', '')), lng: Number(ne.split(',')[1]) },
		sw: { lat: Number(sw.split(',')[0]), lng: Number(sw.split(',')[1].replace(']', '')) },
	};
};

router.post('/add', validateRequestSchema(addReservationSchema), async (req: ExpressRequest, res: Response) => {
	const { vehicleName, startDate, endDate, bounds }: AddReservationSchemaType = req.body;

	const vehicle = await db.vehicle.findFirst({ where: { name: vehicleName } });

	if (!vehicle) return res.status(400).json({ error: `Vehicle with the name "${vehicleName}" does not exist` });

	const sDate = new Date(startDate);
	const eDate = new Date(endDate);

	if (sDate < new Date() || eDate < new Date()) return res.status(400).json({ error: 'Start date and end date must be in the future' });
	if (sDate > eDate) return res.status(400).json({ error: 'Start date must be before end date' });

	const reservationExists = await db.reservation.findFirst({
		where: {
			vehicleId: vehicle.id,
			OR: [
				{ startDate: { lte: sDate }, endDate: { gte: sDate } },
				{ startDate: { lte: eDate }, endDate: { gte: eDate } },
			],
		},
	});

	if (reservationExists) return res.status(400).json({ error: 'Vehicle is already reserved' });

	const reservation = await db.reservation.create({
		data: {
			startDate: sDate,
			endDate: eDate,
			bounds: boundsToString(bounds),
			vehicle: { connect: { id: vehicle.id } },
			user: { connect: { id: req.user!.id } },
		},
	});

	return res.json({
		success: true,
		reservation: (({ id, ...obj }) => obj)(reservation),
	});
});

router.post('/update', async (req: ExpressRequest, res: Response) => {
	const { vehicleName, startDate, endDate, bounds }: AddReservationSchemaType = req.body;
	const { id } = req.user!;

	const vehicle = await db.vehicle.findFirst({ where: { name: vehicleName, userId: id } });

	if (!vehicle) return res.status(400).json({ error: `Vehicle with the name "${vehicleName}" does not exist` });

	const sDate = new Date(startDate);
	const eDate = new Date(endDate);

	if (sDate < new Date() || eDate < new Date()) return res.status(400).json({ error: 'Start date and end date must be in the future' });

	const reservation = await db.reservation.update({
		where: { vehicleId: vehicle.id },
		data: {
			startDate: sDate,
			endDate: eDate,
			bounds: boundsToString(bounds),
		},
	});

	return res.json({
		success: true,
		reservation: (({ id, ...obj }) => obj)(reservation),
	});
});

router.post('/delete', async (req: ExpressRequest, res: Response) => {
	const { vehicleName } = req.body;

	const vehicle = await db.vehicle.findFirst({ where: { name: vehicleName, userId: req.user!.id } });

	if (!vehicle) return res.status(400).json({ error: `Vehicle with the name "${vehicleName}" does not exist` });

	const reservation = await db.reservation.findFirst({ where: { vehicleId: vehicle.id } });

	console.log(vehicle);

	if (!reservation) return res.status(400).json({ error: `Reservation for the vehicle with the name "${vehicleName}" does not exist` });

	await db.reservation.delete({ where: { id: reservation.id } });

	return res.json({
		success: true,
	});
});

router.get('/list', async (req: ExpressRequest, res: Response) => {
	const reservations = await db.reservation.findMany({
		include: { vehicle: true, user: true },
	});

	res.json({
		success: true,
		reservations: reservations.map(({ id, vehicleId, userId, ...obj }) => ({
			...obj,
			bounds: stringToBounds(obj.bounds),
			vehicle: {
				name: obj.vehicle.name,
				type: obj.vehicle.type,
			},
			user: {
				name: obj.user.name,
			},
		})),
	});
});

export default router;
