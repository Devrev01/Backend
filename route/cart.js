import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controller/cart.js';
const router = express.Router()

router.get('/',getCart)
router.post('/', addToCart)
router.delete('/:bookId/:book_id', removeFromCart)

export default router;