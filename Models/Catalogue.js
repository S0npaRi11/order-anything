const mongoose = require('mongoose')

const catalogueSchema = mongoose.Schema({
    itemName:{
        type: String,
        trim: true
    },
    categoryName:{
        type: String,
        trim:true
    },
    addresses:{
        type: Array
    }
})

module.exports = mongoose.model('Catalogue', catalogueSchema)