if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express')
const DB = require('./Configs/Database')
const { error400 } = require('./Configs/errorHandler')

const app = express()

// Database Connection
DB()


// app.use()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.all('/*',(req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Auth-Token"
    );
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS")

    next();
});

// routes
app.use('/customer', require('./Controllers/customers.js'))
app.use('/delivery', require('./Controllers/deliveryPerson.js'))
app.use('/admin', require('./Controllers/admin.js'))
// app.use('/catalogue', require('./Controllers/catalogue.js'))

app.get('*', (req,res) => {
    const err = error400()
    res.status(err.code).json(err)
})
  
// LISTEN TO THE PORT 
app.listen(process.env.PORT || 3000,"0.0.0.0" ,() => {
    console.log('Server Started!!');
})

