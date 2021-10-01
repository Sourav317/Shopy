const express = require('express');
const route = express.Router();
const Urs = require('../Models/connect');


//retrieve and return all users
exports.getallproducts = (req,res)=>{
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
                console.log(arr);
                res.send({
                    Size: arr.length,
                    data:{
                        Tuna : arr
                    }
                });
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }
};


//for deleting a product
exports.deleteProduct = (req, res)=>{
    const id = req.params.id;

    Urs.findByIdAndDelete(id)
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
};