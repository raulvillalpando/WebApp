import express from "express";
import * as fs from "node:fs"
import cors from "cors";
import randomize from "randomatic";
import chalk from "chalk";
import mongoose from "mongoose";

import url from "url";
import path from "path";

const __filename=url.fileURLToPath(import.meta.url);
const __dirname =url.fileURLToPath(new URL(".",import.meta.url));

// Configuracion inicial del servidor
const App = express();
const Port = 3000;

App.use(cors({methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}));

App.use(express.json());

App.use(express.static(__dirname));

App.listen(Port, () =>{
    console.log("Proyecto final");
    console.log("API running on port " + Port);
});

// Configuracion Mongo
let mongoConnection = "mongodb+srv://admin:admin@sayjodb.6pmwkkw.mongodb.net/SayjoDB"
let db = mongoose.connection;

db.on('connecting', () => {
    console.log(chalk.blue("Conectando.. " + mongoose.connection.readyState));
});

db.on('connected', () => {
    console.log(chalk.green("Conectado exitosamente " + mongoose.connection.readyState));
});

mongoose.connect(mongoConnection, {useNewUrlParser: true});

// Mongo Schema Users
let userSchema = mongoose.Schema({
    uID: Number,
    nombre: String,
    apellido: String,
    correo: String,
    contraseña: String,
    numero: String,
    direccion: String,
    sexo: {
        type: String,
        enum: ['M', 'H']
    },
    imagen: String,
    token: String,
    carrito: Array
});

let Users = mongoose.model('users', userSchema);

/* let newUser = {
    nombre: "Ada", 
    apellido: "Iba", 
    correo: "S@gmail", 
    contraseña: "123", 
    numero: "3311701245",
    direccion: "USA, New York",
    sexo: "M"
} */

// Mongo Schema Products
let productSchema = mongoose.Schema({
    nombre: String,
    presentacion: String,
    existencias: Number,
    image: String
});

let Product = mongoose.model('products', productSchema);
/* let newProduct = {nombre: "Cubeta pintura blanca", presentacion: "19L", existencias: 50};
let product = Product(newProduct);
product.save().then((doc) => console.log(chalk.green("Producto agregadp: " + doc))); */

App.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./Frontend/Home.html"));
});

//OBETENER USUARIO CON TOKEN
App.get("/api/usersEdit/:token",(req,res)=>{

    let token = req.params.token;

    Users.findOne({token: {$eq:token} }, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            if (docs == null) {
                res.status(400);
                res.send()
                return;
            }
            else{
                res.status(200);
                res.send(docs)
                return;
            }
        }
    });
});

// REGISTRO Y VALIDACION DE DATOS
App.post('/api/users', (req, res) => {
    
    let nombre = req.body.nombre;
    let apellidos = req.body.apellidos;
    let correo = req.body.correo;
    let contraseña = req.body.contraseña;
    let sexo = req.body.sexo;
    let numero = req.body.numero;
    let Str = "";
    let Flag = false;

    if(nombre == undefined){ Str += "Nombre -"; Flag = true;}
    if(apellidos == undefined){ Str += "Apellidos -"; Flag = true;}
    if(correo == undefined){ Str += "Email -"; Flag = true;}
    if(contraseña == undefined){ Str += "Password -"; Flag = true;}
    if(sexo == undefined){ Str += "Sexo -"; Flag = true;}
    if(numero == undefined){ Str += "Numero -"; Flag = true;}

    
    if(Flag){
        res.status(400);
        res.send("Falta:" + Str);
        console.log(chalk.green("Users Post terminado en error"));
        return;
    }
    else{

        let tempImage;
        if (tempImage == undefined) {
            let StrImage = sexo == "M" ? "women" : "men"
            tempImage = "https://randomuser.me/api/portraits/" + StrImage + "/" + Math.floor(Math.random() * 99)+ ".jpg";
        }

        let tempID = 0;
        
        let newUser = {
            uID: tempID,
            nombre: nombre,
            apellido: apellidos,
            correo: correo,
            contraseña: contraseña,
            numero: numero,
            sexo: sexo,
            imagen: tempImage
        }

        let user = Users(newUser);
        user.save().then((doc) => console.log(chalk.green("Usuario creado: " + doc)));

        let Cnt;
        Users.find().count(function (err, count) {
            if (err) console.log(err)
            
            else {
                Cnt = count;
                console.log("C: " + (Cnt-1));

                if (Cnt != 0) {
                    Users.findOne({uID: {$eq: (Cnt - 1)}}, function (err, docs) {
                        if (err){ console.log(err) }
            
                        else{
                            console.log(docs);
                            if (docs != null) {
                                user.uID = (docs.uID + 1)
                                user.save().then((doc) => console.log(chalk.green("ID actualizado: " + doc.uID)));
                            }
                            
                        }
                    });
                }
                

            }
        });

        res.status(201);
        res.send(newUser);
        console.log(chalk.green("Users Post terminado correctamente"));
                          
    }

});

//DELETE CON USER
App.delete("/api/users/:token", (req, res)=>{

    let token = req.params.token;

    Users.findOneAndDelete({token: {$eq:token} }, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            if (docs == null) {
                res.status(400);
                res.send()
                return;
            }
            else{
                console.log("Deleted User : ", docs);
                res.status(200);
                res.send()
                return;
            }
        }
    });
})

// LOGIN / LOGOUT CON TOKEN
App.get("/api/users/:token", (req, res) =>{

    let Token = req.params.token;

    Users.findOne({token: {$eq: Token}}, function (err, docs) {
        if (err){ console.log(err) }
        else{

            if (docs == null) {
                res.status(400);
                res.send("No token");
                console.log(chalk.green("Users Get Token terminado sin token"));
                return;
            }

            res.status(200);
            res.send(JSON.stringify(docs));
            console.log(chalk.green("Users Get Token terminado con token"));
            return;

        }
    });

});

App.post("/api/login", (req, res) =>{
    
    let Email = req.body.Email;
    let Password = req.body.Password;
    let Str = "";
    let Flag = false;

    if(Email == undefined){ Str += "Email, "; Flag = true;}
    if(Password == undefined){ Str += "Password, "; Flag = true;}
    if(Flag){
        res.status(400);
        res.send("Falta" + Str);
        console.log(chalk.blue("Login Post terminado en error(Faltan campos)"));
        return;
    }
    else{

        // Valida correo y contraseña, y asigna token
        Users.findOne({correo: {$eq: Email}, contraseña: {$eq: Password}}, function (err, docs) {
            if (err){ console.log(err) }
            else{
                
                if (docs == null) {
                    res.status(401);
                    res.send("Correo o contraseña incorrectos");
                    console.log(chalk.blue("Login Post terminado en error(Correo/Contraseña)"));
                    return;
                }

                docs.token = randomize('Aa0','10') + "-" + docs.uID;
                docs.save().then((doc) => console.log(chalk.green("Se guardo token: " + doc)));
                res.set("x-user-token",docs.token);
                res.status(200);
                res.send(docs.token);
                console.log(chalk.blue("Login Post terminado"));
                return;

            }
        });

    }
});

//ACTUALIZAR PERFIL
App.put("/api/edit/:token", (req, res) =>{

    let token = req.params.token;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let contraseña = req.body.contraseña;
    let sexo = req.body.sexo;
    let numero = req.body.numero;

    console.log(nombre);
    Users.findOneAndUpdate({token: {$eq: token} }, 
        {
            nombre: nombre,
            apellido: apellido,
            contraseña: contraseña,
            sexo: sexo,
            numero: numero
        }, 
        null, 
        function (err, docs) {
        if (err){
            console.log(err)
            res.status(400);
            res.send();
            return;
        }
        else{
            console.log("Original Doc : ",docs);
            res.status(200)
            res.send()
            return;
        }
    });
    
});

//CARRITO
App.put("/api/cart/:token", (req, res) =>{

    let token = req.params.token;
    let idProducto = req.body.idProducto;
    console.log("id:" + idProducto);

    Users.findOneAndUpdate({token: {$eq: token} }, 
        {
            $push: {carrito: idProducto} 
        }, 
        null, 
        function (err, docs) {
        if (err){
            console.log(err)
            res.status(400);
            res.send();
            return;
        }
        else{
            console.log("Original Doc : ",docs);
            res.status(200)
            res.send()
            return;
        }
    });
    
});

App.get("/api/cart/:token", (req, res) =>{

    let token = req.params.token;
    let idProducto = req.body.idProducto;
    console.log("id:" + idProducto);

    Users.findOne({token: {$eq: token} }, 
        function (err, docs1) {
        if (err){
            console.log(err)
            res.status(400);
            res.send();
            return;
        }
        else{
            console.log("car:" + docs1.carrito);
            Product.find({Id: {$regex: 1} }, 
                function (err, docs2) {
                if (err){
                    console.log(err)
                    res.status(400);
                    res.send();
                    return;
                }
                else{
                    res.status(200);
                    res.send(docs2);
                    return;
                }
            });
        }
    });
    
});

//OBTENER TODOS LOS PRODUCTOS
App.get("/api/products",(req, res)=>{

    Product.find({}, function (err, docs) {
            if (err){
                console.log(err);
                res.status(400);
            }
            else{
                res.status(200)
                res.send(docs);
                console.log(chalk.green("Users Get Productos terminado"));
                return;
            }
        })

});

App.get("/api/products/:search",(req, res)=>{

    let busqueda = req.params.search;

    Product.find({Categoría: {$regex: busqueda}}, function (err, docs) {
            if (err){
                console.log(err);
                res.status(400);
            }
            else{
                res.status(200)
                res.send(docs);
                console.log(chalk.green(busqueda));
                return;
            }
        })

});










