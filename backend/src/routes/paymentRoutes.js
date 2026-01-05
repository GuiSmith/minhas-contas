import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.get('/:id', paymentController.select);
router.post('/', paymentController.create);
router.delete('/:id', paymentController.remove);

export default router;