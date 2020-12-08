const express = require('express')
const router = express.Router()
const app = express(); 


require("dotenv-safe").config();
const jwt = require('jsonwebtoken');



const Fornecedor = require('./model/Fornecedor')

//Chamando as controllers
const Login_controller = require('./controllers/Login-controller')
const Logout_controller = require('./controllers/Logout-controller')


// Verificar o JWT
function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}

//Routers
    router.get('/teste', verifyJWT, ( req, res, next ) => {
        // res.send("Esta tudo funcionando")
        console.log("Esta tudo funcionando");

        //Se o usuario for Adiministrador envias isso
            // res.json([{id:1,nome:'luiz',auth: true, adm: true}]);
        //else    
            res.json([{id: req.userId ,nome:'luiz',auth: true, adm: true}]);
    })


    //Exemplo Excluir depois
    router.post('/add-fornecedor', ( req, res ) => {

        
        Fornecedor.create({
            id_fornecedor: req.body.id,
            nome: req.body.nome

        }).then(() => res.status(200).json({status: 'fornecedor criado com sucesso'})).catch((err) => res.status(500).json({status: 'Erro ao cadastrar fornecedor'}) )

    })

    //autenticação
    router.post('/login', Login_controller.post)

    router.post('/logout',Logout_controller.post)

    



module.exports = router    