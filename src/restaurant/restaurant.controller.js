// src/restaurant/restaurant.controller.js
const Restaurant = require("./restaurant.model");
const Order = require("../order/order.model");

const createRestaurant = async (req, res) => {
    try {
        const { userId, ...restaurantData } = req.body; 
        restaurantData.adminId = userId;
        const restaurant = new Restaurant(restaurantData);
        const newRestaurant = await restaurant.save();
        res.status(201).json({
            success: true,
            message: 'Restaurante creado exitosamente',
            restaurant: newRestaurant
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear un restaurante' });
    }
};



const readRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;

        if (!restaurantId) {
            res.status(400).json({ error: 'Se requiere un ID de restaurante' });
            return;
        }

        const restaurant = await Restaurant.findOne({ _id: restaurantId, active: true });

        if (!restaurant) {
            res.status(404).json({ error: 'Restaurante no encontrado o inhabilitado' });
            return;
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el restaurante por ID' });
    }
};

const readRestaurants = async (req, res) => {
    try {
        const { category, name } = req.query;
        const query = { active: true };

        if (category) query.category = category;
        if (name) query.name = { $regex: new RegExp(name, 'i') };

        const restaurants = await Restaurant.find(query);

        const calculatePopularity = async (restaurant) => {
            const c = await Order.countDocuments({
                restaurant: restaurant._id,
                status: 'completed',
            });
            restaurant._doc.popularity = c;
            return restaurant;
        };

        const restaurantsPopularityList = await Promise.all(
            restaurants.map(calculatePopularity)
        );

        restaurantsPopularityList.sort((a, b) => b._doc.popularity - a._doc.popularity);

        res.status(200).json(restaurantsPopularityList);
    } catch (err) {
        res.status(500).json(err);
    }
}



const updateRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;

        if (!restaurantId) {
            res.status(400).json({ error: 'Se requiere un ID de restaurante' });
            return;
        }

        const updates = req.body;

        const existingRestaurant = await Restaurant.findOne({ _id: restaurantId, active: true });

        if (!existingRestaurant) {
            res.status(404).json({ error: 'Restaurante no encontrado o inactivo' });
            return;
        }


        const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el restaurante' });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;

        if (!restaurantId) {
            res.status(400).json({ error: 'Se requiere un ID de restaurante' });
            return;
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            res.status(404).json({ error: 'Restaurante no encontrado' });
            return;
        }

        if (!restaurant.active) {
            res.status(200).json({ message: 'El restaurante ya está inactivo' });
            return;
        }

        restaurant.active = false;

        await restaurant.save();

        res.status(200).json({ message: 'Restaurante inhabilitado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al inhabilitar el restaurante' });
    }
};



module.exports = { createRestaurant, readRestaurant, readRestaurants, updateRestaurant, deleteRestaurant };