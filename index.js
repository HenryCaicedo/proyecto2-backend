// index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();


const db = require('./database');
const userRoutes = require('./src/user/user.routes');
const restaurantRoutes = require('./src/restaurant/restaurant.routes');
const productRoutes = require ('./src/product/product.routes');
const orderRoutes = require('./src/order/order.routes');

app.use(cors());
app.use(express.json());

// Enrutador de usuarios
app.use('/users', userRoutes);

// Enrutador de restaurantes
app.use('/restaurants', restaurantRoutes);

// Enrutador de productos
app.use('/products', productRoutes);

// Enrutador de ordenes
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido a la página de inicio');
});
  

app.listen(3000, () =>
    console.log("Sever on port: ", 3000)
);
