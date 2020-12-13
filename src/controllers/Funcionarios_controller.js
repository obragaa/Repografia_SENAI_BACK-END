const express = require('express')
const router = express.Router()
const app = express();
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const mysql = require('../model/db').pool
const bcrypt = require('bcrypt');


exports.post = (req, res) => { 

    console.log("funcionario controller")

    mysql.getConnection((error, conn) => {
        if (error) res.status(500).send({ error: error })

        //setando o numero do senai padrão caso o usuario não coloque numero
        var telefone = '01010101'
        if (req.body.telefone != null) {
            telefone = req.body.telefone
            console.log(req.body.telefone)
        }
        
        bcrypt.hash("senai115", 10, (errBcrypt, hash) => {
            if (errBcrypt) { return res.status(500).send({ error: errorBcrypt }) }
            conn.query(
                'INSERT INTO funcionarios ( nif, nome, sobrenome, email, telefone ,data_criacao, senha, administrativo, situacao, data_suspensao) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [req.body.nif, req.body.nome, req.body.sobrenome, req.body.email, telefone, req.body.data_criacao, hash, req.body.administrativo, req.body.situacao, req.body.data_suspensao],
                (error, resultado, field) => {
                    conn.release()

                    if (error) {
                        return res.status(500).send({
                            error: error,
                            response: null
                        })
                    }
                    res.status(201).send({
                        mesagem: 'Funcionario inserido com sucesso',
                        id_funcionarios: resultado.insertId
                    })
                }
            )
        
        })



    })
}





