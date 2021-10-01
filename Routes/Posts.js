//https://www.youtube.com/watch?v=vjf774RKrLc&t=668s

const express = require('express');
const router = express.Router();
const Urs = require('../Models/connect');
const product_controller = require('./../controller/product_controller');
const auth_controller = require('./../controller/auth_controller');

/*
router.get('/',(req,res) =>{
    res.render('index');
    // Make a get request to /api/users
    axios.get('http://127.0.0.1:5000/p/Add_item')
        .then(function(response){
            console.log(response.data);
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
});
*/

router.get('/Update',(req,res)=>{
    res.render('../views/update_item');
})

router.get('/Add_item',(req,res)=>{
    res.render('../views/Add_item');
})


// Creating new Item 
router.post('/new',(req,res) =>{
    console.log(req.body);
    
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    var arr = new Urs({
        //first parameter Model schema dependent
        //second paramenter depends on the form input name 
        Name : req.body.name,
        //HSN : req.body.HSN,
        Quantity : req.body.quantity,
        Rate : req.body.price
    }).save(function(err,doc){
        if(err) {
            console.log("Error in inserting the data");
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        }
        else{
            console.log("Successfully Inserted the data");
            res.send(doc);
        }
    }
    );

});


//retrieve and return all users
//adding checking middleware to see if the user is logged in with valid credentials to access the 
//protected route which is getallproducts here
router.get('/find',auth_controller.checkUser,product_controller.getallproducts);


// Update a new idetified user by user id
router.put('/update/:id',(req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
});


//authorization
// Delete a user/product with specified user id in the request
//first checking if the user is valid with token n all
//then to delete a product u must be admin
router.put('/delete/:id',auth_controller.checkUser,auth_controller.restrictTo('admin'),product_controller.deleteProduct);

module.exports = router;