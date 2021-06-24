import { Router } from 'express'
import pendingReservesController from '../controllers/pendingReservesController'

const router: Router = Router()

router.get('/', pendingReservesController.getPendingReservesByDepartment)

export default router