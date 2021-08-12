// const express = require('express')
// const CRUD = require('../Configs/CRUD')
// const catalogue = require('../Models/Catalogue')

// const router = express.Router()

// router.route('/')
//     .get((req,res) => {
//         CRUD.readAll(catalogue).then((result) => {
//             res.json(result)
//         }).catch((err) => {
//             res.json(err)
//         });
//     })

//     .post((req,res) => {
//         CRUD.save(catalogue, req.body).then(result =>{
//             res.json(result)
//         }).catch(error => res.json(error))
//     })

// module.exports = router