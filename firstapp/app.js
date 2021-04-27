const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const bp = require('body-parser')
const pool = require("./db")
const http = require('http').Server(app)
const io = require('socket.io')(http)

const admin = require('./admin')
const homepage = require('./homepage')
const wsdetail = require('./wsdetail')



//middleware
app.use(cors());
app.use(express.json()); //req.body


//ROUTES//

app.set('view engine','ejs');
app.use(bp.urlencoded({extended:true}));

app.use('/admin', admin)
app.use('/homepage', homepage)
app.use('/wsdetail', wsdetail)

app.listen(5678, () => {
    console.log("server has started on port 5678...")
});




// user input feedback 
app.post("/give_feedback", async (req, res) => {
  try {
    const { email, WorkspaceID, feedbacktime, feedbackstatus } = req.body;
    const newfeedback = await pool.query(
      "INSERT INTO give_feedback (email, WorkspaceID, feedbacktime, feedbackstatus) VALUES($1,$2,$3,$4) RETURNING *",
      [email, WorkspaceID, feedbacktime, feedbackstatus]
    );
    console.log(req.body);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = app
