const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const bp = require('body-parser')
const pool = require("./db")
const admin = require('./admin')
const realtime = require('./realtime')

app.use(cors());
app.use(express.json())
app.listen(5678, () => {
    console.log("server has started on port 5678...")
});

app.set('view engine','ejs');
app.use(bp.urlencoded({extended:true}))

app.use('/admin', admin)
app.use('/realtime', realtime)

app.get('/cumap', (req, res)=> {
    res.sendFile(path.join(__dirname,'src','map.html'))
    console.log("map shown")
})


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


// show menu of a workspace
app.get("/showmenu/:WorkspaceID", async (req, res) => {
  
  try {
    const { WorkspaceID } = req.params;
    const aWorkspace = await pool.query(
        "SELECT * FROM WS_menu WHERE WorkspaceID = $1", 
        [WorkspaceID]
    );
    res.json(aWorkspace.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


// show photo of a workspace
app.get("/showpic/:WorkspaceID", async (req, res) => {
  try {
    const { WorkspaceID } = req.params;
    const aWorkspace = await pool.query(
        "SELECT * FROM WS_photo WHERE WorkspaceID = $1", 
        [WorkspaceID]
    );
    res.json(aWorkspace.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});








module.exports = app