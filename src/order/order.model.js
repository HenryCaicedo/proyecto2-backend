    // src/order/order.model.js
    const mongoose = require('mongoose');

    const orderSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            default: 'created',
        },
        active: {
        type: Boolean,
        default: true },
    });

    const Order = mongoose.model('Order', orderSchema);

    module.exports = Order;
