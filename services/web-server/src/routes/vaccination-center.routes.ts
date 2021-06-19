import { Router } from 'express';

import { vaccinationCenterController } from '../controllers/vaccinationCenterController';
import authorizationMiddleware from '../middlewares/authorization';

const router: Router = Router();

router.post('/', authorizationMiddleware, vaccinationCenterController.create);
router.post('/vaccination-period', authorizationMiddleware, vaccinationCenterController.createPeriod);

export default router;
