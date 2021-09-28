const Mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = Mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
      },
      email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },
      password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE and SAVE!!!
          validator: function(el) {
            return el === this.password;
          },
          message: 'Passwords are not the same!'
        }
      }
});

UserSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified, bcoz maybe the user only modified the username or email
    //then there is no need to hash password again
    if (!this.isModified('password')) return next();
  
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
  });


//Creating ann instance
UserSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = Mongoose.model('User', UserSchema);
module.exports = User;