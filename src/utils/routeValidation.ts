import { NextFunction, Request, Response } from 'express';
import { verifyToken } from './jwt';
import { ExpressRequest } from './types';

export const auth = async (req: ExpressRequest, res: Response, next: NextFunction) => {
	if (!req?.headers?.authorization) return res.status(401).json({ success: false, error: 'Invalid token' });

	try {
		const payload = verifyToken(req?.headers?.authorization?.replace('Bearer ', ''));
		req.user = payload;
		next();
	} catch (error) {
		return res.status(401).json({ success: false, error: 'Invalid token' });
	}
};

export const noAuth = (req: Request, res: Response, next: NextFunction) => {
	if (req?.headers?.authorization) {
		try {
			const payload = verifyToken(req?.headers?.authorization?.replace('Bearer ', ''));
			throw 401;
		} catch (error) {
			if (error == 401) return res.status(401).json({ success: false, error: "You're already logged in" });
		}
	}

	next();
};
