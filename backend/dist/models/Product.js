"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    sellerId: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)('Product', productSchema);
