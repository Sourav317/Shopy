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
                res.send(arr);
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }
};