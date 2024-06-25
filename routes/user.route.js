const express = require('express');
const userRouter = express.Router();
const { UserController } = require('../controllers');
const verifyJwt = require('../middlewares/verifyJwt');

userRouter.get('/test/access-all', UserController.accessAll);

userRouter.get(
    '/test/access-moderator',
    [verifyJwt.verifyToken, verifyJwt.isModerator],
    UserController.accessModerator
);

userRouter.get('/test/access-admin', UserController.accessAdmin);

module.exports = userRouter;
