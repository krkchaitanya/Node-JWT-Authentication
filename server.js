const express = require('express');
const bodyParser=require("body-parser");
const { mongoose}=require("mongoose");
const _=require("lodash");
var { User}=require("./user");

var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const port=process.env.PORT||3300;


app.post("/users",(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  var user=new User(body);
  user.save().then(()=>{
return user.generateAuthToken();
  }).then((token)=>{
    console.log(token);
    res.header("x-auth",token).send(user);
  }).catch((e)=>{
    res.send(e);
  })
});

var authenticate=(req,res,next)=>{

  var token=req.header('x-auth');
  User.findByToken(token).then((user)=>{
    if(!user){

    }
    req.user=user;
    req.token=token;
    next();
  }).catch((e)=>{
    res.status(401).send();
  })
};


app.post("/users/login",(req,res)=>{

  var body=_.pick(req.body,['email','password']);
  User.findByCredentails(body.email,body.password).then((user)=>{
    res.send(user);
  }).catch((err)=>{
    res.send(err);
  })
});


app.delete("/users/me/token",authenticate,(req,res)=>{

req.user.removeToken(req.token).then(()=>{
  res.status(200).send();
},()=>{
  res.status(400).send();
})

});

app.get("/users/me",authenticate,(req,res)=>{
  res.send(req.user);
});


app.listen(port,()=>{
  console.log(`app is running on port ${port}`)
});
