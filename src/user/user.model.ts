import { CallbackError, Schema, model } from "mongoose";
const bcrypt = require("bcrypt");

interface IUser {
  name: string;
  password: string;
  email: string;
  phone_number: string;
  address: string;
  active: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        "Por favor, agrega un email válido",
      ],
    },
    phone_number: {
      type: String,
      unique: true,
      required: true,
      maxlength: 10,
      minlength: 10,
    },
    address: {
      type: String,
      required: true,
      maxlength: 48,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, collection: "users" }
);


userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err: CallbackError | undefined, hash: string) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function ( password: string ): Promise<boolean> {
  if (!password) {
    throw new Error("¡Falta la contraseña!");
  } else {
    try {
      const result = await bcrypt.compare(password, this.password);
      return result;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  }
};

export default model<IUser>("user", userSchema);
