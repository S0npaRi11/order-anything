const responce = require('./Responce');

const errors = {
    error404(error = null) {
        // do some things which are to be doen with this error
        responce.result = error
        responce.message = 'Error : Record not found'
        responce.code = 404
        return responce
    },

    error401() {
        // do some things which are to be doen with this error
        responce.result = null
        responce.message = 'Error : Authentication failed'
        responce.code = 401
        return responce
    },

    error500(error = null) {
        // do some things which are to be doen with this error
        responce.result = error
        responce.message = 'Error : Could not connect to the server'
        responce.code = 500
        return responce
    },

    error400(message = null) {
        // do some things which are to be doen with this error
        responce.result = null
        responce.message = message ? message : 'Error: Bad request'
        responce.code = 400
        return responce
    }

}

module.exports = errors