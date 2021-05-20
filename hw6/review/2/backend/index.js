import { Router } from 'express';
import apiRouter from './api';

const router = Router();
//console.log("index.js");
router.use('/api', apiRouter);

export default router;
