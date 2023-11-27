import { Schema, model } from "mongoose";

export interface IPedido {
  client: Schema.Types.ObjectId;
  seller: Schema.Types.ObjectId;
  products: [{ producto: Schema.Types.ObjectId, quantity: Number }];
  totalPrice: Number;
  comments: String;
  score: Number;
  active: boolean;
}

const pedidoSchema = new Schema<IPedido>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      validate: {
        validator: async function (value: string) {
          const user = await model("user").findOne({
            _id: value,
          });
          return user !== null || user.active == true;
        },
        message: "Usuario no encontrado",
      },
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      validate: {
        validator: async function (value: string) {
          const user = await model("user").findOne({
            _id: value,
          });
          return user !== null || user.active == true;
        },
        message: "Usuario no encontrado",
      },
    },
    products: [{
      producto: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
        validate: {
          validator: async function (value: string) {
            const producto = await model("product").findOne({
              _id: value
            });
            if (producto == null || producto.active != true) {
              throw new Error('No se encontro el producto');
            }
          }
        }
      },
      quantity: { type: Number, required: true }
    }
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    comments: {
      type: String,
    },
    score: {
      type: Number
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "pedidos" }
);

export default model<IPedido>("pedido", pedidoSchema);
