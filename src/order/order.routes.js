// src/order/order.routes.js
const { Router } = require("express");
const { createOrder, readOrder, readOrders, readSentOrder ,updateOrder, deleteOrder } = require("./order.controller");
const router = Router();

// Crear orden
router.post('/', createOrder);

// Buscar orden
router.get('/:orderId', readOrder);

// New route to read filtered orders
router.get('/', readOrders);

// New route to read sent orders
router.get('/sent', readSentOrder);

// Actualizar info de orden
router.patch('/:orderId', updateOrder);

// Inhabilitar orden
router.delete('/:orderId', deleteOrder);


module.exports = router;
