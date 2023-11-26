// database.js
const { Db } = require("mongodb");
const mongoose = require("mongoose");


// usar archivo .env para ocultar la cadena y .gitignore para ignorar dicho archivo
mongoose.connect(process.env.cadena).then(Db=>console.log("Conectado a BD")).catch(err => console.error(err));
