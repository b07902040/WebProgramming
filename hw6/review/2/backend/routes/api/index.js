import { Router } from 'express';
import scoreCardRouter from './scoreCard';

const router = Router();
console.log("api index.js");
router.use('/', scoreCardRouter);

export default router;
