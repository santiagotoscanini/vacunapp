import { Router } from 'express'
import appliedVaccinesController from '../controllers/appliedVaccinesController'

const router: Router = Router()

router.get('/departments/working-times', appliedVaccinesController.getCountOfAppliedVaccinesByDateRange)
router.get('/departments/zones', appliedVaccinesController.getCountOfAppliedVaccinesByDateAndAgeRange)

export default router
