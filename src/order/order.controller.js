const Order = require("./order.model");

const createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const order = new Order(orderData);
        const newOrder = await order.save();
        res.status(201).json({
            success: true,
            message: 'Orden creada exitosamente',
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear una orden' });
    }
};


const readOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404).json({ error: 'Orden no encontrada o inhabilitada' });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la orden por ID' });
    }
};


const readOrders = async (req, res) => {
    try {
        const { userId, restaurantId, startDate, endDate } = req.query;

        const filter = {};

        if (userId) {
            filter.userId = userId;
        }


        if (restaurantId) {
            filter.restaurantId = restaurantId;
        }

        if (startDate && endDate) {
            filter.datetime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const filteredOrders = await Order.find(filter);

        res.status(200).json(filteredOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const readSentOrder = async (req, res) => {
    try {
        const sentOrders = await Order.find({
            status: 'sent',
            active: true,
        });

        res.status(200).json(sentOrders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        if (!orderId) {
            res.status(400).json({ error: 'Se requiere un ID de orden' });
            return;
        }

        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404).json({ error: 'Orden no encontrada' });
            return;
        }

        if (!order.active) {
            res.status(400).json({ error: 'No se pueden actualizar órdenes inactivas' });
            return;
        }

        if (order.status == 'sent'){
            res.status(400).json({ error: 'No se pueden actualizar órdenes ya enviadas' });
            return;
        }

        const updatedOrderData = req.body;
        Object.assign(order, updatedOrderData);

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la orden' });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        if (!orderId) {
            res.status(400).json({ error: 'Se requiere un ID de orden' });
            return;
        }

        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404).json({ error: 'Orden no encontrada' });
            return;
        }

        order.active = false;
        await order.save();

        res.status(200).json({ message: 'Orden inhabilitada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al inhabilitar la orden' });
    }
};


module.exports = { createOrder, readOrder, readOrders, readSentOrder ,updateOrder, deleteOrder };
