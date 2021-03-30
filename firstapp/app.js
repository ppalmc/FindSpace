const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const bp = require('body-parser')
const pool = require("./db")

app.use(cors());
app.use(express.json())
app.listen(5678, () => {
    console.log("server has started on port 5678...")
});

app.set('view engine','ejs');

app.use(bp.urlencoded({extended:true}))
app.use(express.json());

app.get('/cumap', (req, res)=> {
    res.sendFile(path.join(__dirname,'src','map.html'))
    console.log("E Y A I")
})
app.post('/cumap',(req,res)=>{
    // const obj = JSON.parse(JSON.stringify(req.body));
    console.log(req.body)
})

//ROUTES//

// create new workspace

app.post("/workspace", async (req, res) => {
  try {
    const { location, sname, wifi, totalseats, ophours, occupiedseats, spicture, menu, poweroutlets } = req.body;
    const newWorkspace = await pool.query(
      "INSERT INTO Workspace (location, sname, wifi, totalseats, ophours, occupiedseats, spicture, menu, poweroutlets) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
      [location, sname, wifi, totalseats, ophours, occupiedseats, spicture, menu, poweroutlets]
    );
    console.log(req.body);
  } catch (err) {
    console.error(err.message);
  }
});

// show all workspace 

app.get("/workspace", async (req, res) => {
  try {
    const allWorkspace = await pool.query("SELECT * FROM workspace");
    res.json(allWorkspace.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a workspace

app.get("/workspace/:workspace_id", async (req, res) => {
  try {
    const { workspace_id } = req.params;
    const aWorkspace = await pool.query(
        "SELECT * FROM workspace WHERE workspace_id = $1", 
        [workspace_id]
    );

    res.json(aWorkspace.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//modify a workspace's totalseats

app.put("/workspace/:workspace_id", async (req, res) => {
  try {
    const { workspace_id } = req.params;
    const { location, sname, wifi, totalseats, ophours, occupiedseats, spicture, menu, poweroutlets } = req.body;
    const updateTotalseats = await pool.query(
      "UPDATE workspace SET totalseats = $1 WHERE workspace_id = $2",
      [totalseats, workspace_id]
    );

    res.json("The workspace was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a workspace

app.delete("/workspace/:SName", async (req, res) => {
  try {
    const { SName } = req.params;
    const deleteWorkspace = await pool.query(
        "DELETE FROM Workspace WHERE SName = $1", 
        [SName]
    );
    res.json("The workspace was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});
