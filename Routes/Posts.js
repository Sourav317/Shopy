//https://www.youtube.com/watch?v=vjf774RKrLc&t=668s

const express = require('express');
const router = express.Router();
const Urs = require('../Models/connect');


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
router.get('/find',(req,res) =>{
    //for particular item
    if(req.query.id){
        const id = req.query.id;
        console.log(id);
        Urs.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data);
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }
    else{    
        // will show all the data in db
        Urs.find()
            .then(arr => {
                res.send(arr)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }
});


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


// Delete a user with specified user id in the request
router.put('/delete/:id',(req, res)=>{
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
});

module.exports = router;