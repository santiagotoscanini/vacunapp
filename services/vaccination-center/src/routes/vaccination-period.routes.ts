import { Router } from 'express';

import vaccinationPeriodsController from '../controllers/vaccinationPeriodController';

const router: Router = Router();

router.post('/', vaccinationPeriodsController.create);

export default router;
