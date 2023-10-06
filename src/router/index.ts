import { Router } from 'express';
import loginRouter from './login';
import registerRouter from './register';
import vehicleRouter from './vehicle';
import { auth, noAuth } from '../utils/routeValidation';

const router = Router();

router.use('/register', noAuth, registerRouter);
router.use('/login', noAuth, loginRouter);
router.get('/', (req, res) => {
	res.send('API');
});

router.use('/vehicle', auth, vehicleRouter);

export default router;
