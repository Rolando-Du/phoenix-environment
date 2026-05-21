import { Router } from 'express';

import { getCurrentAlertController } from '../controllers/alert.controller';

const router = Router();

router.get('/current', getCurrentAlertController);

export default router;