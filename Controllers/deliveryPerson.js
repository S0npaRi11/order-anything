const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const deliveryPerson = require('../Models/DeliveryPerson')
const orders = require('../Models/Order')
const crud = require('../Configs/CRUD')
const responce = require('../Configs/Responce')
const authenticate = require('../Configs/auth')
const errorHandler = require('../Configs/errorHandler')


const router = express.Router()

router.route('/signup')
    .post((req,res) => {
        if(req.body.phoneNo.trim().length === 10){
            crud.findOne(deliveryPerson, {phoneNo: req.body.phoneNo}).then(foundDeliveryPerson =>{
                if(!foundDeliveryPerson){
                    bcrypt.hash(req.body.password, 10, function(error, hash) {
                        if(error){
                            const e = errorHandler.error500(error)
                            res.status(e.code).json(e)
                        }else{
                            req.body.password = hash
    
                            crud.save(deliveryPerson, req.body)
                                .then(savedDeliveryPerson => {
                                    responce.code = 201
                                    responce.result = savedDeliveryPerson
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
            crud.findOne(deliveryPerson, {phoneNo: req.body.phoneNo}).then(foundDeliveryPerson => {
                if(!foundDeliveryPerson){
                    const e = errorHandler.error404('Error : mobile number not found')
                    res.status(e.code).json(e)
                }else{
                    bcrypt.compare(req.body.password, foundDeliveryPerson.password, (error, result) => {
                        if(error){
                            const e = errorHandler.error500(error)
                            res.status(e.code).json(e)
                        }
    
                        if(result){
                            const token = jwt.sign(foundDeliveryPerson.toJSON(), process.env.JWT_SECRET_TOKEN,{expiresIn:'1h'})
    
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
        crud.readAll(orders, {deliveryPersonID: req.user._id}).then(foundOrders => {

            responce.code = 200
            responce.result = foundOrders
            responce.message = `Total ${foundOrders.length} order(s) found`

            res.status(200).json(responce)

        }).catch(error => {
            const e = errorHandler.error500(error)
            res.status(e.code).json(e)
        })
    })

router.route('/order/:id')
    .get(authenticate, (req,res) => {
        crud.readOne(orders, req.params.id).then(foundOrder => {
            if(foundOrder.deliveryPersonID === req.user._id){

                responce.code = 200
                responce.result = foundOrder
                responce.message = 'Order found'

                res.status(200).json(responce)

            }else{
                const e = errorHandler.error400('Error : Forbidden Access')
                res.status(403).json(e)
            }
        }).catch(error =>{
            const e = errorHandler.error500(error)
            res.status(e.code).json(e)
        })
    })

    .patch(authenticate, (req,res) => {
        const updatedStatus = {
            orderStage: req.body.orderStage
        }

        const validStatus = ['reached-store','items-picked', 'enroute', 'delivered', 'canceled']

        if(validStatus.includes(updatedStatus.orderStage)){
            crud.readOne(orders, req.params.id).then(foundOrder => {
                if(foundOrder.deliveryPersonID === req.user._id){
                    crud.update(orders,updatedStatus, req.params.id).then(updatedOrder => {
    
                        responce.code = 200
                        responce.result = updatedOrder
                        responce.message = 'Order status updated'
            
                        res.status(200).json(responce)
                    }).catch(error => {
                        const e = errorHandler.error500(error)
                        res.status(e.code).json(e)
                    })
                }else{
                    const e = errorHandler.error400('Error : Forbidden Access')
                    res.status(403).json(e)
                }
            }).catch(error => {
                const e = errorHandler.error500(error)
                res.status(e.code).json(e)
            })
        }else{
            const e = errorHandler.error400('Error : Invalid status')
            res.status(400).json(e)

        }

        
    })

module.exports = router