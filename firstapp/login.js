const express = require('express')
const app = express()
const path = require('path')
const bp = require('body-parser')

app.listen(7854);

app.use(bp.urlencoded({extended:true}))
app.use(bp.json());

app.get('/login', (req, res)=> {
    res.sendFile(path.join(__dirname,'src','login.html'))
})
app.post('/login',(req,res)=>{
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log(obj) 
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



var users = {
    id_00000: {
        username: palm,
        password: sueak,
        lat: 16.9879710,
        lng: 108.7987287
    },
    id_68762: {
        username: mrnobody,
        password: plshelp,
        lat: 78.7657489,
        lng: 66.0987868
    },
    id_87198: {
        username: kuay,
        password: broooooooo,
        lat: 15.9084352,
        lng: 90.8767548
    },
}

