import Razorpay from "razorpay";
import { Request, Response } from "express";
import { env } from "../config/env";
import crypto from "crypto";
import { orderService } from "../services/order.service";

const razorpay = new Razorpay({
  key_id: env.razorpayKey,
  key_secret: env.razorpaySecret,
});

// SECURITY: the amount charged is always derived from live product prices in
// the DB, never from a client-supplied `amount`. Otherwise anyone could edit
// the request in devtools and pay whatever they wanted for a cart.
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const authoritativeAmount = await orderService.computeAuthoritativeTotal(items);

    const order = await razorpay.orders.create({
      amount: Math.round(authoritativeAmount * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Return the server-computed amount too, so the frontend can display/confirm
    // the real charge instead of relying on its own (untrusted) calculation.
    res.json({ ...order, veloriaAmount: authoritativeAmount });
  } catch (e: any) {
    console.error(e);
    res.status(e?.statusCode || 500).json({ message: e?.message || "Failed to create order" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload,
    } = req.body;

    // @ts-ignore
    const userId = req.user._id.toString();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", env.razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // orderService.createOrder recomputes the total from the DB itself and
    // ignores orderPayload.amount — this is what actually gets stored/charged
    // against, the Razorpay order created earlier already used the same
    // server-computed amount, so the two can never drift apart.
    const order = await orderService.createOrder(
      userId,
      orderPayload.addressId,
      "RAZORPAY",
      orderPayload.items,
      undefined,
      orderPayload.address
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error: any) {
    console.error("Verify Payment Error:", error);

    return res.status(error?.statusCode || 500).json({
      success: false,
      message: error?.message || "Payment verification failed",
    });
  }
};