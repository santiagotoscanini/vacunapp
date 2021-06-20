import { Router } from 'express'

import vaccinationCenterController from '../controllers/vaccinationCenterController'

const router: Router = Router()

router.post('/', vaccinationCenterController.create)

export default router
