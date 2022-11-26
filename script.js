const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');
const product = require('./product');
const userdata = require('./user');
var session = require('express-session');
const { resolve } = require('path');




//to get req.body
app.use(express.urlencoded({extended:false}))


//view engine set up

app.engine('hbs',hbs.engine({extname: 'hbs', defaultLayout:'layout', layoutsDir: __dirname +'/views'}))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs')

//adding public folder
app.use(express.static(path.join(__dirname,'public')));


//express session creating
app.use(session({secret:"key",cookie:{maxAge:60000}}))



app.get('/',function(req,res){
    let user = req.session.user;
    
    res.render('home',{user,product});
})

app.get('/signup',(req,res)=>{
    
    if(req.session.loggedIn){
        let user = req.session.user;
        res.render('home',{user,product});
    }
    else{
        res.render('login');
    }
    
})

app.post('/signup',(req,res)=>{
   let user=req.body;

   if(userdata.email === user.email && userdata.password === user.password){
    
    req.session.loggedIn = true;
    req.session.user = user;
    res.render('home',{user,product});
   }
   else {
    let noUser = true;
    res.render('login',{noUser});
   }    
    // res.send('form submitted')
})

app.get('/logout',function(req,res){
    let loggedOut = true;
    req.session.destroy()
    res.render('login',{loggedOut});
})




app.listen(3000,function(){
    console.log ('server started');
})


