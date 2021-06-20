import { Router } from 'express'

import reserveController from '../controllers/reserveController'

const router: Router = Router()

router.post('/', reserveController.create)

export default router
