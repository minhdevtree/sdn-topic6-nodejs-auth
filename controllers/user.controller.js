const db = require('../models');

async function accessAll(req, res, next) {
    res.status(200).json({
        message: 'Access all users',
    });
}

async function accessModerator(req, res, next) {
    res.status(200).json({
        message: 'Access moderator',
    });
}

async function accessAdmin(req, res, next) {
    res.status(200).json({
        message: 'Access admin',
    });
}

const userController = {
    accessAll,
    accessModerator,
    accessAdmin,
};

module.exports = userController;
