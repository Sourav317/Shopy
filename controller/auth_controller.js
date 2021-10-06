const crypto = require('crypto');
//dont require to install crypto

const { promisify } = require('util');
const User = require('../Models/users');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail= require('./../utils/email');

exports.signup = async (req,res,next) =>{
    try{
    const new_user = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm,
        role : req.body.role
        //passwordChangedAt : req.body.passwordChangedAt
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
if (currentUser.changedPasswordAfter(decoded.iat)) {
  return next(
    new AppError('User recently changed password! Please log in again.', 401)
  );
}

// GRANT ACCESS TO PROTECTED ROUTE
req.user = currentUser;
  next();
});


// As we cant pass arguments into middlewares, so to resolve we need wrapper function 
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};


exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

// 3) Send it to user's email
const resetURL = `${req.protocol}://${req.get(
  'host'
)}/api/v1/users/resetPassword/${resetToken}`;

const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

try {
  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    message
  });

res.status(200).json({
  status: 'success',
  message: 'Token sent to email!'
});
}catch (err) {
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return next(
    new AppError('There was an error sending the email. Try again later!'),
    500
  );
}
});