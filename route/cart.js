import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controller/cart';
const router = express.Router()

router.get('/',getCart)
router.post('/', addToCart)
router.delete('/:bookId', removeFromCart)

export default router;