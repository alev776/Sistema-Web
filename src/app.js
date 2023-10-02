const express = require('express');
require('./db/mongoose');
const path = require('path');
const cors = require('cors');
const login = require('./routes/login');
const categorias = require('./routes/categorias');
const articulos = require('./routes/articulos');
const ingresos = require('./routes/ingresos');
const Clientes = require('./routes/Clientes');
const Proveedores = require('./routes/Proveedores');
const Ventas = require('./routes/Ventas');
const Detalle_Ventas = require('./routes/Detalle_Ventas');

const app = express();

const publicDirectory = path.join(__dirname, '../public');

app.use(express.json());
//app.use(cors({origin: 'http://localhost:8080'}));
app.use(cors({origin: 'https://sales-app-rd-b9050328b101.herokuapp.com/'}));
// app.use(cors({origin: 'https://web-ventas-app.herokuapp.com/'}));
app.use(express.static(publicDirectory));
app.use(login);
app.use(categorias);
app.use(articulos);
app.use(ingresos);
app.use(Clientes);
app.use(Proveedores);
app.use(Ventas);
app.use(Detalle_Ventas);

// const Categoria = require('./models/categorias');
// const User = require('./models/user');

// const main = async () => {
//     // const categoria = await Categoria.findById('5ee3a15a9f810f3ad42deab4');
//     // await categoria.populate('owner').execPopulate();
//     // console.log(categoria.owner);

//     const user = await User.findById('5ee3a0dc9f810f3ad42deab2');
//     await user.populate('categorias').execPopulate();
//     console.log(user.categorias);
// }

// main();

module.exports = app;
