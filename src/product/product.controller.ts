import { Request, Response } from "express";
import Product, { IProduct } from "./producto.model"; // Importa el modelo de usuario definido en Mongoose
import { generateToken } from "../auth/auth_token";

//Creación de productos
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price, user, session } = req.body; // Obtén las propiedades del cuerpo de la solicitud

    // Crea un nuevo producto utilizando el modelo de Mongoose
    const product = new Product({
      name,
      description,
      category,
      price,
      user,
    });

    // Guarda el producto en la base de datos
    if (session && typeof session === 'object' && typeof session.startTransaction === 'function' && typeof session.commitTransaction === 'function' && typeof session.abortTransaction === 'function') {
      await product.save({ session: session });
    } else {
      await product.save();
    }

    res.status(201).json({ message: "Producto creado exitosamente", product });
  } catch (error) {
    console.log('Error de producto', error)
    res.status(500).json({ message: "Error al crear el producto", error });
  }
};

//Obtener product por id
export async function getProductById(req: Request, res: Response) {
  try {
    const { _id } = req.params;

    const producto = await Product.findOne({ _id: _id, active: true });

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
}

//Obtener productos por usuario, texto de búsqueda y/o por categoría
export async function getProductsbyCategoryAndUser(
  req: Request,
  res: Response
) {
  //Falta agregar lo del texto de búsqueda
  try {
    const { user, category } = req.query;
    const filtro: any = {};
    if (user) {
      filtro.user = user;
    }
    if (category) {
      filtro.category = category;
    }
    //Buscamos solo los que estén activos
    filtro.active = true;
    const productos = await Product.find(filtro);
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
}

//Obtener categorías de los productos de un usuario proveído
export async function getProductCategoriesByUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const productos = await Product.find({ user: userId, active: true });
    const categories = productos.map((producto: IProduct) => producto.category);

    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al obtener las categorías de productos" });
  }
}

//Actualizar producto
export async function updateProduct(req: Request, res: Response) {
  //Aquí opto por usar tanto params como body
  const { _id } = req.params;
  const { session, updates } = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: _id, active: true },
      updates,
      {
        new: true,
        runValidators: true,
        session: session
      }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error al actualizar el producto." });
  }
}

//Borrar producto
export async function deleteProduct(req: Request, res: Response) {
  //Aquí uso params
  const _id = req.params;
  const { session } = req.body
  try {
    //El usuario se inhabilita, en vez de borrarse
    const deletedProduct = await Product.findOneAndUpdate(
      { _id: _id, active: true },
      { active: false },
      { session: session }
    );
    if (!deletedProduct)
      return res.status(404).json({ message: "Producto no encontrado" });

    res.status(200).json({ message: "Producto inhabilitado correctamente." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
}
