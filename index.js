const express = require('express');
const app = express();
const ejs = require('ejs')
const mongoose = require('mongoose');
const axios = require('axios');
require ('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');

var bodyParser = require('body-parser');

//inbuild node dependency
const path = require('path');

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
//adding routers
//watch YOutube channel- 'https://www.youtube.com/watch?v=iM_S4RczozU&ab_channel=SteveGriffith' 
//https://www.youtube.com/watch?v=W1Kttu53qTg
//for understanding router better


//set view engine to use HTML/EJS templete/code
//if your engine is just HTML then give HTML instead of ejs.
app.set("view engine",'ejs');
//if my HTML files were inside some folder in views folder then had to access them using path
//app.set("views",path.resolve(__dirname,"views/folder_name"))
//__dirname : It will resolve to your project folder.

//set Assets
app.use(express.static('assets'));
//app.set("css",path.resolve(__dirname,"assets/css"));
//app.set("img",path.resolve(__dirname,"assets/img"));

//Routes
const post = require('./Routes/Posts.js');
const user_route = require('./Routes/User_routes.js');

//middleware
app.use('/p',post);
app.use('/user',user_route);


//Connecting to DB(Atlas - Modify password and database created name)
const Db = process.env.DATABASE;
mongoose.connect(Db,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(() =>{
    console.log("Db Connected");
}).catch((err) =>{
    console.log("Db Error in connection  ", err);
})


// Session config
//https://stackoverflow.com/questions/66654037/mongo-connect-error-with-mongo-connectsession
app.use(
    session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE ,
        collection: 'sessions'}),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour   once the cookie expires the session will be closed n there wil be no data of the user
})
)

app.use(flash())

//Routes
app.get('/cart',(req,res)=>{
    res.render('cart');
});

app.get("/",(req,res)=>{
    //res.render('index',{users : "New_Data"});
    //to get all the items/users from DB using the find method in Posts.js
    axios.get('http://localhost:5000/p/find')
        .then(function(response){
            //console.log("here is",response.data);
            status : 'success';
            res.render('index', { users : response.data });
        })
        .catch(err =>{
            res.send(err);
        })
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT , console.log(`Server is running on ${PORT}`));