import { NextFunction, Request, Response } from 'express';
import { z, AnyZodObject } from 'zod';

export const validateRequestSchema = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.parseAsync(req.body);

		return next();
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const registerSchema = z.object({
	email: z.string().email('Invalid email address'),
	name: z.string().min(1, 'Name is required'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const addVehicleSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	type: z.number().min(0).max(1),
	dataUrl: z.string().optional(),
	videoUrl: z.string().optional(),
});

export type AddVehicleSchemaType = z.infer<typeof addVehicleSchema>;

export const addReservationSchema = z.object({
	vehicleName: z.string().min(1, 'Vehicle name is required'),
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().min(1, 'Start date is required'),
	bounds: z.object({
		ne: z.object({
			lat: z.number(),
			lng: z.number(),
		}),
		sw: z.object({
			lat: z.number(),
			lng: z.number(),
		}),
	}),
});

export type AddReservationSchemaType = z.infer<typeof addReservationSchema>;
