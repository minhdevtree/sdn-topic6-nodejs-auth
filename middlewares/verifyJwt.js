const db = require('../models');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const authCofig = require('../configs/auth.config');
const User = db.user;
const Role = db.role;

async function verifyToken(req, res, next) {
    try {
        const tokenRequest = req.headers['x-access-token'];
        console.log('token request', tokenRequest);
        if (!tokenRequest) {
            throw createError.BadRequest('No token provide');
        }

        // Verify token
        jwt.verify(tokenRequest, authCofig.secret, (err, decode) => {
            if (err) {
                const message =
                    err instanceof jwt.TokenExpiredError
                        ? 'Token is expired'
                        : err.message;

                throw createError.Unauthorized(message);
            }

            console.log(decode);

            // Update req
            req.userId = decode.id;
            next();
        });
    } catch (error) {
        next(error);
    }
}

async function isModerator(req, res, next) {
    try {
        const userId = req.userId;

        const user = await User.findOne({
            _id: userId,
        }).populate('roles');

        if (!user) {
            throw createError.NotFound('User not found');
        }

        const isModerator = Role.find({ _id: { $in: user.roles } });

        if (!isModerator) {
            throw createError.Forbidden('Require Moderator Role');
        }

        for (let i = 0; i < user.roles.length; i++) {
            if (user.roles[i].name === 'moderator') {
                next();
                return;
            }
        }

        throw createError.Unauthorized('Require Moderator Role');
    } catch (error) {
        next(error);
    }
}

async function isAdmin(req, res, next) {
    try {
        const userId = req.userId;

        const user = User.findOne({
            _id: userId,
        });

        if (!user) {
            throw createError.NotFound('User not found');
        }

        const isAdmin = Role.find({ _id: { $in: user.roles } });

        if (!isAdmin) {
            throw createError.Forbidden('Require Admin Role');
        }

        for (let i = 0; i < user.roles.length; i++) {
            if (isAdmin[i].name === 'admin') {
                next();
                return;
            }
        }

        throw createError.Unauthorized('Require Admin Role');
    } catch (error) {
        next(error);
    }
}

const verifyJwt = {
    verifyToken,
    isModerator,
    isAdmin,
};

module.exports = verifyJwt;
