import { Router } from 'express'

import reserveController from '../controllers/reserveController'

const router: Router = Router()

router.post('/', reserveController.create)
router.delete('/', reserveController.delete)
router.get('/', reserveController.read)

export default router
