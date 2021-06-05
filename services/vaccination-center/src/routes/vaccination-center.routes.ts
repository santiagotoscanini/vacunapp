import { Router } from 'express';

import { vaccinationCenterController } from '../controllers/vaccinationCenterController';

const authorizationMiddleware = require('../middlewares/authorization');

const router: Router = Router();

router.post('/', authorizationMiddleware.authenticateToken, vaccinationCenterController.create);

export default router;
