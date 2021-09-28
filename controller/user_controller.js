const User = require('./../Models/users');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    
    console.log(users);
    
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  });