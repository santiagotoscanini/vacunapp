import { Router } from 'express'

import configController from '../controllers/configController'

const router: Router = Router()

router.post('/algorithm', configController.changeAlgorithm)
router.get('/algorithm', configController.fetchAlgorithms)
router.put('/sms', configController.changeSmsUrl)
router.put('/id-provider', configController.changeIdProviderUrl)

export default router
