const express = require('express');
const route = express.Router();
const UserController = require('./../controller/user_controller');

route.post('/signup',UserController.signup);

module.exports = route;