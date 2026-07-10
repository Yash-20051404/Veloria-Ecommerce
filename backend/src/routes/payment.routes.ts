import { Router } from "express";
import { authenticate } from "../services/auth.middleware";
import { createRazorpayOrder } from "../controllers/payment.controller";
import { verifyPayment } from "../controllers/payment.controller";



const router = Router();

router.post("/create-order", authenticate, createRazorpayOrder);
router.post("/verify", authenticate, verifyPayment);

export default router;