import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.get('/list', categoryController.list);
router.get('/:id',categoryController.select);
router.put('/:id',categoryController.update);
router.delete('/:id',categoryController.remove);
router.post('/', categoryController.create);

export default router;