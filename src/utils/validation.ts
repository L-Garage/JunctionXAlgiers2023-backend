import { NextFunction, Request, Response } from 'express';
import { z, AnyZodObject } from 'zod';

export const validateRequestSchema = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
	try {
		await schema.parseAsync({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		return next();
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const registerSchema = z.object({
	body: z.object({
		email: z.string().email('Invalid email address'),
		name: z.string().min(1, 'Name is required'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	}),
});

export const loginSchema = z.object({
	body: z.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
	}),
});
