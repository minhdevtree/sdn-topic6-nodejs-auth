const bcrypt = require('bcrypt');
const db = require('../models/index');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const authConfig = require('../configs/auth.config');
const User = db.user;
const Role = db.role;

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const newUser = new User({
                email: req.body.email,
                password: bcrypt.hashSync(
                    req.body.password,
                    +process.env.PASSWORD_KEY
                ),
                type: req.body.type,
            });

            if (req.body.roles) {
                // Admin add new user with roles
                const roles = await Role.find({
                    name: { $in: req.body.roles },
                });
                // Update new user's roles
                newUser.roles = roles.map(role => role._id);
                // Save new user
                // await newUser.save();
                await User.create(newUser).then(data => {
                    res.status(201).json(data);
                });
            } else {
                const role = await Role.findOne({ name: 'member' });
                newUser.roles = [role._id];
                await User.create(newUser).then(data => {
                    res.status(201).json(data);
                });
            }
        } catch (error) {
            next(error);
        }
    },
    signIn: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw createError.BadRequest('Email or password is rewquired');
            }

            const existUser = await User.findOne({
                email,
            }).populate('roles', 'name');

            if (!existUser) {
                throw createError.BadRequest('Email is not signed up');
            }

            const isMatchPassword = bcrypt.compareSync(
                password,
                existUser.password
            );

            if (isMatchPassword) {
                // Generate Accesstoken - using Jsonwebtoken
                const token = jwt.sign(
                    { id: existUser._id },
                    authConfig.secret,
                    {
                        algorithm: 'HS256',
                        expiresIn: authConfig.jwtExpiration,
                    }
                );

                const authorities = [];

                for (let i = 0; i < existUser.roles.length; i++) {
                    authorities.push(
                        `ROLE_${existUser.roles[i].name.toUpperCase()}`
                    );
                }

                res.status(200).json({
                    id: existUser._id,
                    email: existUser.email,
                    accessToken: token,
                    roles: authorities,
                });
            } else {
                throw createError.Unauthorized('Username/password not valid');
            }
        } catch (error) {
            next(error);
        }
    },
};
