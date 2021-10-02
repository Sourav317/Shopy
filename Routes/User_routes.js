const express = require('express');
const route = express.Router();
const AuthController = require('../controller/auth_controller');
const UserController = require('../controller/User_controller');

route.post('/signup',AuthController.signup);
route.post('/login',AuthController.login);

route.get('/getAllUser',UserController.getAllUsers);

route.post('/forgotPassword', AuthController.forgotPassword);
//route.patch('/resetPassword/:token', AuthController.resetPassword);

module.exports = route;