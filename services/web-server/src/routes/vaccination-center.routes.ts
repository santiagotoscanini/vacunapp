import { Router } from 'express'
import authorizationMiddleware from '../middlewares/authorization'
import vaccinationCenterController from '../controllers/vaccinationCenterController'

const router: Router = Router()

router.post('/', authorizationMiddleware, vaccinationCenterController.create)
router.get('/remaining-vaccines', authorizationMiddleware, vaccinationCenterController.getRemainingVaccines)
router.get('/vaccines', authorizationMiddleware, vaccinationCenterController.getVaccines)
router.post('/vaccinations', authorizationMiddleware, vaccinationCenterController.vaccinate)

export default router
