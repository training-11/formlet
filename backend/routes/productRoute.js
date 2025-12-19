import express from 'express';
import { getPublicCategories, getPublicProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/categories', getPublicCategories);
router.get('/products', getPublicProducts);

export default router;
