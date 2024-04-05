const mongoose = require('mongoose');
const { option } = require('../routes');
const url = process.env.DB_URL
const connectDB = () => {
    return mongoose.connect(url)
}
module.exports = connectDB;