import { Router } from 'express';
import db from '../utils/db';
import { hashPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

const router = Router();

router.post('/', async (req, res) => {
	const { email, password } = req.body;

	const user = await db.user.findUnique({ where: { email } });

	if (!user) return res.status(400).json({ error: 'User does not exist' });

	if (user.password !== hashPassword(password, user.id)) return res.status(400).json({ error: 'Incorrect password' });

	const token = generateToken(user.id);

	res.json({ success: true, token });
});

export default router;
