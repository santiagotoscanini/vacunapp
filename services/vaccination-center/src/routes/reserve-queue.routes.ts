import { Router } from 'express'

import reserveQueueController from '../controllers/reserveQueueController'

const router: Router = Router()

router.post('/:id', reserveQueueController.create)
router.get('/', reserveQueueController.read)

export default router
