import express from 'express';
import billController from '../controllers/billController.js';

const router = express.Router();

router.get('/dash', billController.dashboard);
router.get('/', billController.list);
router.get('/:id', billController.select);
router.put('/:id', billController.update);
router.post('/', billController.create);

export default router;