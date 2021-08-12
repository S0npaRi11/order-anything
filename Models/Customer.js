const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
    phoneNo:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Customers', customerSchema)