import { Schema, model } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  category: string;
  price: Number;
  user: Schema.Types.ObjectId;
  active: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 140,
    },
    category: {
      type: String,
      required: true,
    },
    price: { type: Number, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      validate: {
        validator: async function (value: string) {
          const user = await model("user").findOne({
            _id: value,
          });
          return user !== null;
        },
        message: "Usuario no encontrado",
      },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "products" }
);

export default model<IProduct>("product", productSchema);
