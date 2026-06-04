import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getAllOrders);
router.put('/:id/status', OrderController.updateOrderStatus);
router.get('/:id/invoice', OrderController.downloadInvoice);
router.get('/customer/:email', OrderController.getMyOrders);

export { router as orderRoutes };