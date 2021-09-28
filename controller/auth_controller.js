const User = require('../Models/users');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signup = async (req,res,next) =>{
    try{
    const new_user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });
    
    console.log("user successfully inserted as data ",new_user);
//                  (can be anything)Payload       +  secrect(here 32 unit long)   +  expiresin
    const token = jwt.sign({ id : new_user._id }, process.env.JWT_SECRET, {
        expiresIn : "10h"
    });
    
    res.status(201).json({
        status : 'success',
        token,
        body : {
            Tuna : new_user
        }
    });
    }catch(err){
        console.log(" error occured :- ", err);
        res.json({
            status : 'FAIL',
            message : err
        })
    }
};


exports.login = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    // 1) Check if email and password entered by user
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct

    // user is coming from DB(correct credentials from Db to be matched with input fields(email and password))
        const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
  
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
    /*
    const token = '';
    res.status(200).json({
        status : 'success',
        token
    })
    */
  });