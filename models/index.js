const mongoose = require('mongoose');
const User = require('./user.model');
const Role = require('./role.model');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = User;
db.role = Role;

db.ROLES = ['member', 'admin', 'moderator'];

// connect db da viet trong configs/mongoose.config.js viet lai vao day cho giong thay
db.connectDb = async () => {
    await mongoose
        .connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        })
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch(error => {
            console.error('MongoDB connection error: ', error.message);
            process.exit(1);
        });
};

module.exports = db;
