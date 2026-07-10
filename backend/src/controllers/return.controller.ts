import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { Order } from '../models/Order';
import { ReturnRequest } from '../models/ReturnRequest';
import { AppError } from '../utils/errors';

// ───────────────────── BUYER ENDPOINTS ─────────────────────



export const createReturnRequest = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  const { orderId, items, reason, requestType, description, images, exchangeVariant } = req.body;

  if (!orderId || !items || !reason || !requestType) {
    throw new AppError(400, 'Missing required fields: orderId, items, reason, and requestType are required.');
  }


  if (!['RETURN', 'EXCHANGE'].includes(requestType)) {
    throw new AppError(400, 'requestType must be RETURN or EXCHANGE.');
  }

  const validReasons = ['Wrong Size', 'Damaged Product', 'Incorrect Item', 'Changed Mind', 'Other'];
  if (!validReasons.includes(reason)) {
    throw new AppError(400, `Invalid reason. Must be one of: ${validReasons.join(', ')}`);
  }

  const order = await Order.findOne({ _id: orderId, userId }).select('+items');

  if (!order) {
    throw new AppError(404, 'Order not found or does not belong to the user.');
  }

  // Verify all requested items exist in the order
const orderItemIds = order.items.map((item: any) => String(item.productId));

const invalidItems = items.filter(
  (item: any) => !orderItemIds.includes(String(item.productId))
);

if (invalidItems.length > 0) {
  throw new AppError(
    400,
    `Invalid items: ${invalidItems
      .map((i: any) => i.productId)
      .join(", ")} not found in order`
  );
}

  if (order.status.toLowerCase() !== 'delivered') {
  throw new AppError(
    400,
    'Return/exchange can only be requested for delivered orders.'
  );
}

  //Check 7-day window from delivery date
  
  if (!order.deliveredAt) {
    throw new AppError(400, 'Delivery timestamp missing. Cannot verify return eligibility.');
  }
  const deliveryDate = order.deliveredAt;
  const daysSinceDelivery = Math.floor((Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceDelivery > 7) {
    throw new AppError(400, 'Return/exchange window has expired (7 days from delivery).');
  }

  // Prevent duplicate requests
  const existingRequest = await ReturnRequest.findOne({ orderId, userId });
  if (existingRequest) {
    throw new AppError(400, 'A return or exchange request already exists for this order.');
  }

  if (images && (!Array.isArray(images) || images.length > 5)) {
    throw new AppError(400, 'Maximum 5 images allowed.');
  }

  const newReturnRequest = await ReturnRequest.create({
    userId,
    orderId,
    items,
    reason,
    requestType,
    status: 'PENDING',
    description: description || '',
    images: images || [],
    exchangeVariant: exchangeVariant || '',
  });

  // Update order flags
  if (requestType === 'RETURN') {
    order.returnRequested = true;
  } else {
    order.exchangeRequested = true;
  }
  await order.save();

  res.status(201).json({
    success: true,
    message: `${requestType === 'RETURN' ? 'Return' : 'Exchange'} request submitted successfully.`,
    data: newReturnRequest,
  });
});

export const getMyReturns = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  
  const requests = await ReturnRequest.find({ userId })
    .populate('orderId', 'orderId status amount createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: requests,
  });
});

export const getReturnById = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  const request = await ReturnRequest.findOne({ _id: req.params.id, userId })
    .populate('orderId', 'orderId status amount items createdAt');

  if (!request) {
    throw new AppError(404, 'Return request not found.');
  }

  res.status(200).json({
    success: true,
    data: request,
  });
});

// ───────────────────── ADMIN ENDPOINTS ─────────────────────

export const getAllReturns = asyncHandler(async (req: Request, res: Response) => {
  const { status, type, search, page = '1', limit = '20' } = req.query;
  
  const filter: any = {};
  
  if (status && status !== 'ALL') {
    filter.status = status;
  }
  
  if (type && type !== 'ALL') {
    filter.requestType = type;
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  // If search is provided, find matching orderIds first
  if (search && typeof search === 'string' && search.trim()) {
    const searchStr = search.trim();
    const matchingOrders = await Order.find({
      $or: [
        { orderId: { $regex: searchStr, $options: 'i' } },
        { customerName: { $regex: searchStr, $options: 'i' } }
      ]
    }).select('_id');
    
    if (matchingOrders.length > 0) {
      filter.orderId = { $in: matchingOrders.map(o => o._id) };
    } else {
      // No matching orders found, return empty
      res.status(200).json({
        success: true,
        data: [],
        pagination: { page: pageNum, limit: limitNum, total: 0, pages: 0 }
      });
      return;
    }
  }

  const [requests, total] = await Promise.all([
    ReturnRequest.find(filter)
      .populate('userId', 'name email phone')
      .populate('orderId', 'orderId status amount items createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .exec(),
    ReturnRequest.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data: requests,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  });
});

export const updateReturnStatus = asyncHandler(async (req: Request, res: Response) => {
  const { action } = req.body;
  const { adminNotes } = req.body;
  
  if (!['APPROVE', 'REJECT'].includes(action)) {
    throw new AppError(400, 'Action must be APPROVE or REJECT.');
  }

  const request = await ReturnRequest.findById(req.params.id);
  if (!request) {
    throw new AppError(404, 'Return request not found.');
  }

  if (request.status !== 'PENDING') {
    throw new AppError(400, 'This request has already been processed.');
  }

  request.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  request.processedAt = new Date();

  if (adminNotes) {
    request.adminNotes = adminNotes;
  }

  await request.save();

  // Sync order refund status
  if (action === 'APPROVE' && request.requestType === 'RETURN') {
    const order = await Order.findById(request.orderId);
    if (order) {
      order.refundStatus = 'Pending';
      await order.save();
    }
  }

  res.status(200).json({
    success: true,
    message: `Request ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully.`,
    data: request,
  });
});

export const markRefundStatus = asyncHandler(async (req: Request, res: Response) => {
  const { refundStatus } = req.body;

  if (!['Processing', 'Refunded'].includes(refundStatus)) {
    throw new AppError(400, 'Refund status must be Processing or Refunded.');
  }

  const request = await ReturnRequest.findById(req.params.id);
  if (!request) {
    throw new AppError(404, 'Return request not found.');
  }

  if (request.requestType !== 'RETURN') {
    throw new AppError(400, 'Refund status is only applicable to return requests.');
  }

  if (request.status !== 'APPROVED' && request.status !== 'PROCESSING') {
    throw new AppError(400, 'Request must be approved before processing refund.');
  }

  request.refundStatus = refundStatus;
  if (refundStatus === 'Refunded') {
    request.status = 'COMPLETED';
    request.processedAt = new Date();
  } else {
    request.status = 'PROCESSING';
  }
  await request.save();

  // Sync order status
  const order = await Order.findById(request.orderId);
  if (order) {
    order.refundStatus = refundStatus;
    await order.save();
  }

  res.status(200).json({
    success: true,
    message: `Refund status updated to ${refundStatus}.`,
    data: request,
  });
});

export const markExchangeComplete = asyncHandler(async (req: Request, res: Response) => {
  const request = await ReturnRequest.findById(req.params.id);
  if (!request) {
    throw new AppError(404, 'Return request not found.');
  }

  if (request.requestType !== 'EXCHANGE') {
    throw new AppError(400, 'This action is only applicable to exchange requests.');
  }

  if (request.status !== 'APPROVED') {
    throw new AppError(400, 'Exchange must be approved before marking as completed.');
  }

  request.status = 'COMPLETED';
  request.processedAt = new Date();
  await request.save();

  res.status(200).json({
    success: true,
    message: 'Exchange completed successfully.',
    data: request,
  });
});

export const addAdminNotes = asyncHandler(async (req: Request, res: Response) => {
  const { notes } = req.body;

  if (!notes) {
    throw new AppError(400, 'Notes are required.');
  }

  const request = await ReturnRequest.findById(req.params.id);
  if (!request) {
    throw new AppError(404, 'Return request not found.');
  }

  request.adminNotes = notes;
  await request.save();

  res.status(200).json({
    success: true,
    message: 'Admin notes updated successfully.',
    data: request,
  });
});