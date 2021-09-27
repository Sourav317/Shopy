const user = require('./../Models/users');

exports.signup = async (req,res,next) =>{
    try{
    const new_user = await user.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });
    
    console.log("user successfully inserted as data ",new_user);
    
    res.status(201).json({
        status : 'success',
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