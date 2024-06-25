const db = require('../models');
const createError = require('http-errors');
const User = db.user;
const Role = db.role;
const ROLES = db.ROLES;

// Check existing user
async function checkExistingUser(req, res, next) {
    try {
        if (!req.body.email || !req.body.password) {
            throw createError.BadRequest('Please provide email and password');
        }
        if (await User.findOne({ email: req.body.email })) {
            throw createError.Conflict('Email is already in use');
        }
        next();
    } catch (error) {
        next(error);
    }
}

async function checkExistingRole(req, res, next) {
    try {
        if (req.body.roles) {
            for (let i = 0; i < req.body.roles.length; i++) {
                if (!ROLES.includes(req.body.roles[i])) {
                    throw createError.BadRequest(
                        `Role ${req.body.roles[i]} does not exist`
                    );
                }
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}

const VerifySignup = {
    checkExistingUser,
    checkExistingRole,
};

module.exports = VerifySignup;
