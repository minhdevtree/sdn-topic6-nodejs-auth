const express = require('express');
const authRouter = express.Router();

const { AuthController } = require('../controllers');
const VerifySignup = require('../middlewares/verifySignup');

authRouter.post(
    '/signup',
    [VerifySignup.checkExistingUser, VerifySignup.checkExistingRole],
    AuthController.signUp
);

authRouter.post('/signin', AuthController.signIn);

module.exports = authRouter;
