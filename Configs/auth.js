const jwt = require('jsonwebtoken');
const errorHandler = require('./errorHandler');

const varify = (req,res,next) => {

    const token = req.header('Auth-Token');

    if(!token) {
        const err = errorHandler.error401()
        res.status(err.code).json(err)
    }
   
    try{
        const varified = jwt.verify(token,process.env.JWT_SECRET_TOKEN);
        req.user = varified;
        next()
    }catch(error){
        //set req.user to null
        req.user = null;
        const err = errorHandler.error401()
        res.status(err.code).json(err)
    }
}

module.exports = varify;