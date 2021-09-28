const express = require('express');
const route = express.Router();
const AuthController = require('../controller/auth_controller');
const UserController = require('../controller/User_controller');

route.post('/signup',AuthController.signup);
route.post('/login',AuthController.login);

route.get('/getAllUser',UserController.getAllUsers);

module.exports = route;