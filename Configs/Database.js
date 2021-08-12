const mongoose = require('mongoose');

mongoose.set('returnOriginal', false);

let Database = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
    const db = mongoose.connection
    db.on('error', error => console.error(error));
    db.once('open', () => console.log('connected to the database'));
}  

module.exports = Database