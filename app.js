const express = require('express')
const app = express()
const path = require('path')
const bp = require('body-parser')
const joi = require('joi')

app.listen(5678);

app.set('view engine','ejs');

app.use(bp.urlencoded({extended:true}))
app.use(bp.json());

app.get('/',(req,res)=>{
    res.send('Welcome');
    
})


app.get('/login', (req, res)=> {
    res.sendFile(path.join(__dirname,'src','login.html'))
})
app.post('/login',(req,res)=>{
    console.log(req.body) 


    // const user = joi.object().keys({
    //     username: joi.string().min(3).max(20).required(),
    //     password: joi.string().min(5).max(10).required(),
        // latitude: joi.number().precision(6).min(-90).max(90).required(),
        // longitude: joi.number().precision(6).min(-180).max(180).required()  
    // });
    // const validation = user.validate(req.body);
    // res.send(validation);
    res.json({success : true});
});

app.get('/cumap', (req, res)=> {
    res.sendFile(path.join(__dirname,'src','map.html'));
    console.log("E Y A I");
});
app.post('/cumap',(req,res)=>{
    // const obj = JSON.parse(JSON.stringify(req.body));
    console.log(req.body);
});