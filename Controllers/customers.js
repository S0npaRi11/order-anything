const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const customers = require('../Models/Customer')
const orders = require('../Models/Order')
const catalogue = require('../Models/Catalogue')
const crud = require('../Configs/CRUD')
const responce = require('../Configs/Responce')
const authenticate = require('../Configs/auth')
const errorHandler = require('../Configs/errorHandler')


const router = express.Router()

router.route('/signup')
    .post((req,res) => {
        if(req.body.phoneNo.trim().length === 10){
            crud.findOne(customers, {phoneNo: req.body.phoneNo}).then(foundCustomer =>{
                if(!foundCustomer){
                    bcrypt.hash(req.body.password, 10, function(error, hash) {
                        if(error){
                            const e = errorHandler.error500(error)
                            res.status(e.code).json(e)
                        }else{
                            req.body.password = hash
    
                            crud.save(customers, req.body)
                                .then(savedCustomer => {
                                    responce.code = 201
                                    responce.result = savedCustomer
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
        if(req.body.phoneNo.trim().length === 10){
            crud.findOne(customers, {phoneNo: req.body.phoneNo}).then(foundCustomer => {
                if(!foundCustomer){
                    const e = errorHandler.error404('Error : mobile number not found')
                    res.status(e.code).json(e)
                }else{
                    bcrypt.compare(req.body.password, foundCustomer.password, (error, result) => {
                        if(error){
                            const e = errorHandler.error500(error)
                            res.status(e.code).json(e)
                        }
    
                        if(result){
                            const token = jwt.sign(foundCustomer.toJSON(), process.env.JWT_SECRET_TOKEN,{expiresIn:'1h'})
    
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

router.route('/order')
    .get(authenticate, (req,res) => {
        crud.readAll(orders, {customerID: req.user._id}).then(foundOrders => {
            responce.code = 200
            responce.result = foundOrders
            responce.message = `Total ${foundOrders.length} orders found`

            res.status(200).json(responce)

        }).catch(error => {
            const e = errorHandler.error500(error)
            res.status(e.code).json(e)  
        })
    })

    .post(authenticate, (req,res) => {
        let avialbleProducts = []
        let pickup = []

        req.body.items.forEach(i => {
            crud.findOne(catalogue, {itemName: i.itemName}).then(result => {
                if(result){
                    pickup.push(result.addresses[Math.floor(Math.random() * result.addresses.length)])
                    avialbleProducts.push(i)
                }

                req.body.items = avialbleProducts
                req.body.pickupLocations = pickup

                req.body.customerID = req.user._id
                if(req.body.items.length !== 0){

                    avialbleProducts = []
                    pickup = []

                    crud.save(orders, req.body).then(savedOrder => {
                        responce.code = 200
                        responce.result = savedOrder
                        responce.message = 'order placed'
            
                        res.status(200).json(responce)
                    }).catch(error => {
                        const e = errorHandler.error500(error)
                        res.status(e.code).json(e)  
                    })
                }else{
                    const e = errorHandler.error400('Error : Products not available')
                    res.status(400).json(e)
                }
            })
        })
    })

router.route('/order/:id')
    .get(authenticate, (req,res) => {
        crud.readOne(orders, req.params.id).then(foundOrder => {
            if(foundOrder.customerID === req.user._id){
                responce.code = 200
                responce.result = foundOrder
                responce.message = 'Order found'
    
                res.status(200).json(responce)
            }else{
                const e = errorHandler.error400('Error : Forbidden Access')
                res.status(403).json(e)
            }
        }).catch(error => {
            const e = errorHandler.error500(error)
            res.status(e.code).json(e) 
        })
    })


module.exports = router