import jwt from 'jsonwebtoken';

const jwtExpire = 3 * 24 * 60 * 60;

export const generateToken = (id: string) => jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: jwtExpire });
export const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

export type TokenPayload = {
	id: string;
	iat: number;
	exp: number;
};
