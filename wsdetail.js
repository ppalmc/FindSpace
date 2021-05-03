const express = require('express')
const app = express()
const { pool } = require("./dbConfig");
const route = express.Router()
const cors = require("cors")
const bp = require("body-parser")

//middleware
route.use(cors());
route.use(express.json()); //req.query


//ROUTES//
route.use(bp.urlencoded({extended:true}));

// show menu of a workspace
route.get("/showmenu/:WorkspaceID", async (req, res) => {
  
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
route.get("/showpic/:WorkspaceID", async (req, res) => {
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

// show ophours of a workspace
route.get("/showophour/:WorkspaceID", async (req, res) => {
  
  try {
    const { WorkspaceID } = req.params;
    const aWorkspace = await pool.query(
        "SELECT * FROM WS_oh WHERE WorkspaceID = $1", 
        [WorkspaceID]
    );
    res.json(aWorkspace.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// show details of a workspace
route.get("/workspace/:WorkspaceID", async (req, res) => {
  try {
    const { WorkspaceID } = req.params;
    const aWorkspace = await pool.query(
        "SELECT * FROM workspace WHERE WorkspaceID = $1", 
        [WorkspaceID]
    );
    res.json(aWorkspace.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// show crowdedness of a workspace
route.get("/crowdedness/:workspaceID", async (req, res) => {
  try {
    const { workspaceID } = req.params;
    const crowdedness = await pool.query("SELECT H.workspaceid, H.suminout, W.totalseat, W.workspaceid, H.suminout/W.totalseat AS crowdedness, CASE WHEN H.suminout/W.totalseat<=0.25 THEN 1 WHEN H.suminout/W.totalseat>0.25 AND H.suminout/W.totalseat <= 0.5 THEN 3 ELSE 5 END AS crowdednessStatus FROM ( SELECT workspaceid, sum(num_in_out) AS suminout FROM hardware H GROUP BY workspaceid ) AS H, ( SELECT workspaceid, totalseat FROM workspace W ) AS W WHERE H.workspaceid = W.workspaceid AND H.workspaceid = $1",
      [workspaceID]
    );
    console.log(crowdedness.rows);
    res.json(crowdedness.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = route