const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    items:[{
        itemName:{
            type: String,
            required: true,
            trim: true
        },
        quantity:{
            type: Number,
            required: true
        }
    }],
    deliveryPersonID: {
        type: String,
        trim: true,
        default: 'Not Assigned Yet'
    },
    orderStage:{
        type: String,
        trim: true,
        default: 'task-created'
    },
    customerID:{
        type: String,
        required: true,
        trim: true
    },
    pickupLocations:{
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Orders', orderSchema)