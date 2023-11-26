// src/product/product.controller.js
const Product = require("./product.model");

const createProduct = async (req, res) => {
    try {
        const productData = req.body;

        const product = new Product(productData);

        const newProduct = await product.save();

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            product: newProduct,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear un producto' });
    }
};


const readProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            res.status(400).json({ error: 'Se requiere un ID de producto' });
            return;
        }

        const product = await Product.findById(productId);

        if (!product || !product.active) {
            res.status(404).json({ error: 'Producto no encontrado o inhabilitado' });
            return;
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto por ID' });
    }
};



const readProducts = async (req, res) => {
    try {
        const { category, restaurant } = req.query;
        const query = { active: true };

        if (category) query.category = category;
        if (restaurant) query.restaurant = restaurant;

        const productList = await Product.aggregate([
            { $match: query },
            { $sort: { category: 1 } },
            {
              $group: {
                _id: '$category',
                products: { $push: '$$ROOT' },
              },
            },
          ]);
      
          res.status(200).json(productList);
        } catch (err) {
          res.status(500).json(err);
        }
};


const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            res.status(400).json({ error: 'Se requiere un ID de producto' });
            return;
        }

        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }

        if (!product.active) {
            res.status(400).json({ error: 'No se pueden actualizar productos inactivos' });
            return;
        }

        const updatedProductData = req.body;
        Object.assign(product, updatedProductData);

        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!productId) {
            res.status(400).json({ error: 'Se requiere un ID de producto' });
            return;
        }

        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }

        product.active = false;
        await product.save();

        res.status(200).json({ message: 'Producto inhabilitado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al inhabilitar el producto' });
    }
};



module.exports = { createProduct, readProduct, readProducts, updateProduct, deleteProduct };