import { Router } from 'express';

import {
  getAqiHistoryController,
  getAqiSummaryController,
  getNearbyAqi,
} from '../controllers/aqi.controller';

const router = Router();

router.get('/nearby', getNearbyAqi);
router.get('/history', getAqiHistoryController);
router.get('/summary', getAqiSummaryController);

export default router;