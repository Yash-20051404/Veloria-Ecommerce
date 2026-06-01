"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    buyerId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    productIds: [{ type: mongoose_1.Types.ObjectId, ref: 'Product', required: true }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'fulfilled', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
