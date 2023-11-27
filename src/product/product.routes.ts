import express from "express";
import { authenticateToken } from "../auth/auth_token";
import {
  createProduct,
  getProductById,
  getProductCategoriesByUser,
  getProductsbyCategoryAndUser,
  updateProduct,
  deleteProduct,
} from "./producto.controller";

const router = express.Router();

// Ruta para crear un producto (necesita token)
router.post("/", authenticateToken, createProduct);

//Ruta para obtener un producto según el ID
router.get("/ById/:_id", getProductById);

//Ruta para obtener un producto según la categoría, el usuario y/o el texto de búsqueda
router.get("/ByCategoryAndUser", getProductsbyCategoryAndUser);

//Ruta para obtener las categorías de los productos de un usuario
router.get("/CategoriesByUser/:_id", getProductCategoriesByUser);

//Ruta para inhabilitar un producto según el ID (necesita token)
router.patch("/:_id", authenticateToken, updateProduct);

//Ruta para inhabilitar un producto según el ID (necesita token)
router.delete("/:_id", authenticateToken, deleteProduct);

export default router;
