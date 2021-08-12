const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const admin = require('../Models/Admin')
const orders = require('../Models/Order')
const deliveryPerson = require('../Models/DeliveryPerson')
const crud = require('../Configs/CRUD')
const responce = require('../Configs/Responce')
const authenticate = require('../Configs/auth')
const errorHandler = require('../Configs/errorHandler')


const router = express.Router()

router.route('/signup')
    .post((req,res) => {
        if(req.body.phoneNo.trim().length === 10){
            crud.findOne(admin, {phoneNo: req.body.phoneNo}).then(foundAdmin =>{
                if(!foundAdmin){
                    bcrypt.hash(req.body.password, 10, function(error, hash) {
                        if(error){
                            const e = errorHandler.error500(error)
                            res.status(e.code).json(e)
                        }else{
                            req.body.password = hash
    
                            crud.save(admin, req.body)
                                .then(savedAdmin => {
                                    responce.code = 201
                                    responce.result = savedAdmin
                                    responce.message = 'SignUp sucessful'
    
                                    res.status(201).json(responce)
    
                                })
                                .catch(error => {
                                    const e = errorHandler.error500(error)
                                    res.status(e.code).json(e)
                                })
                        }
                    })
                }else{
                    const e = errorHandler.error400('Error: mobile number already exists')
                    res.status(e.code).json(e)
                }
            }).catch(error => {
                const e = errorHandler.error500(error)
                res.status(e.code).json(e)
            })
        }else{
            const e = errorHandler.error400()
            res.status(e.code).json(e)
        }
        
    })

router.route('/login')
    .post((req,res) => {
        console.log(req.body.phoneNo.trim().length === 10)
        if(req.body.phoneNo.trim().length === 10){
            crud.findOne(admin, {phoneNo: req.body.phoneNo}).then(foundAdmin => {
                if(!foundAdmin){
                    const e = errorHandler.error404('Error : mobile number not found')
                    res.status(e.code).json(e)
                }else{
                    bcrypt.compare(req.body.password, foundAdmin.password, (error, result) => {
                        if(error){
                            const e = errorHandler.error500(error)
                            res.status(e.code).json(e)
                        }
    
                        if(result){
                            const token = jwt.sign(foundAdmin.toJSON(), process.env.JWT_SECRET_TOKEN,{expiresIn:'1h'})
    
                            responce.code = 200
                            responce.result = token
                            responce.message = 'Authentication Sucessful'
                        
                            res.status(200).json(responce)
                        }else{
                            const e = errorHandler.error401()
                            res.status(e.code).json(e)
                        }
                    })
                }
            }).catch(error => {
                const e = errorHandler.error500(error)
                res.status(e.code).json(e)
            })
        }else{
            const e = errorHandler.error400()
            res.status(e.code).json(e)
        }
        
    })

router.route('/delivery')
    .get(authenticate, (req,res) => {
        crud.readAll(deliveryPerson).then(foundDeliveryPersons => {

            responce.code = 200
            responce.result = foundDeliveryPersons
            responce.message = `Total ${foundDeliveryPersons.length} delivery person(s) found`

            res.status(200).json(responce)

        }).catch(error => {
            const e = errorHandler.error500(error)
            res.status(e.code).json(e)
        })
    })

router.route('/order')
    .get(authenticate, (req,res) => {
        crud.readAll(orders).then(foundOrders => {

            responce.code = 200
            responce.result = foundOrders
            responce.message = `Total ${foundOrders.length} order(s) found`

            res.status(200).json(responce)
        }).catch(error => {
            const e = errorHandler.error500(error)
            res.status(e.code).json(e)  
        })
    })

router.route('/order/:q') 
    .get(authenticate, (req,res) => { // here, q  = orderStatus
        crud.readAll(orders, {orderStage: req.params.q}).then(foundOrders => {

            responce.code = 200
            responce.result = foundOrders
            responce.message = `Total ${foundOrders.length} order(s) found with ${req.params.q} status`

            res.status(200).json(responce)

        }).catch(error => {
            const e = errorHandler.error500(error)
            res.status(e.code).json(e)  
        })
    })

    .patch(authenticate, (req,res) => { // here, q = orderID
        const deliveryPerson = {
            deliveryPersonID : req.body.deliveryPersonID
        }

        crud.update(orders, deliveryPerson, req.params.q).then(updatdOrder => {

            responce.code = 200
            responce.result = updatdOrder
            responce.message = `Delivery person added` 

            res.status(200).json(responce)

        }).catch(error => {
            const e = errorHandler.error500(error)
            res.status(e.code).json(e)  
        })
    }) 


module.exports = router