import { Router } from 'express'
import authorizationMiddleware from '../middlewares/authorization'
import vaccinationPeriodsController from '../controllers/vaccinationPeriodController'

const router: Router = Router()

router.post('/', authorizationMiddleware, vaccinationPeriodsController.create)

export default router
