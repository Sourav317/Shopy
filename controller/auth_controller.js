const { promisify } = require('util');
const User = require('../Models/users');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
        expiresIn : "90d"
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
  
    // 1) Check if email and password entered by user i.e., both the fields have to be entered by the user and not just one
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
    //createSendToken(user, 200, res);

    let token = jwt.sign({ id : user._id }, process.env.JWT_SECRET, {
        expiresIn : "90d"
    });
    
    //const token = '';
    res.status(200).json({
        status : 'success',
        token
    });
  });


  //for checking the user is logged in or not with valid token
  exports.checkUser = catchAsync(async (req, res, next) => {
      // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  //promisify coming from utility
const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
// decoded will be an object which will contain our payload(i.e., User_id here)
//console.log(decoded);

// 3) Check if user still exists
//what if the user was deleted after the token was issued.....user was naughty one
//if the token was stolen and the user decided to change his password
const currentUser = await User.findById(decoded.id);
if (!currentUser) {
  return next(
    new AppError(
      'The user belonging to this token does no longer exist.',
      401
    )
  );
}


// 4) Check if user changed password after the token was issued


  next();
});

