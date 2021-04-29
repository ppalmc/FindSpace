const express = require('express')
const app = express()
const path = require('path')
const bp = require('body-parser')
const joi = require('joi')

app.listen(5678);

app.set('view engine','ejs');

app.use(bp.urlencoded({extended:true}))
app.use(bp.json());

app.get('/login', (req, res)=> {
    res.sendFile(path.join(__dirname,'src','login.html'))
})
app.post('/login',(req,res)=>{
    console.log(req.body) 


<<<<<<< Updated upstream
    // const user = joi.object().keys({
    //     username: joi.string().min(3).max(20).required(),
    //     password: joi.string().min(5).max(10).required(),
        // latitude: joi.number().precision(6).min(-90).max(90).required(),
        // longitude: joi.number().precision(6).min(-180).max(180).required()  
    // });
    // const validation = user.validate(req.body);
    // res.send(validation);
    res.json({success : true});
=======
// user input feedback 
app.post("/give_feedback", async (req, res) => {
  try {
    const { email, WorkspaceID, feedbacktime, feedbackstatus } = req.query;
    const newfeedback = await pool.query(
      "INSERT INTO give_feedback (email, WorkspaceID, feedbacktime, feedbackstatus) VALUES($1,$2,$3,$4) RETURNING *",
      [email, WorkspaceID, feedbacktime, feedbackstatus]
    );
    console.log(req.body);
  } catch (err) {
    console.error(err.message);
  }
>>>>>>> Stashed changes
});

app.get('/cumap', (req, res)=> {
    res.sendFile(path.join(__dirname,'src','map.html'))
    console.log("E Y A I")
})
app.post('/cumap',(req,res)=>{
    // const obj = JSON.parse(JSON.stringify(req.body));
    console.log(req.body)
})