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
    const crowdedness = await pool.query("SELECT R1.workspaceid, R2.workspaceid,R2.wsname, R1.ppl_in_WS, R2.totalseat, (R1.ppl_in_WS::FLOAT/R2.totalseat::FLOAT) AS crowdedness, CASE WHEN (R1.ppl_in_WS::FLOAT/R2.totalseat::FLOAT)<=0.25 THEN 1 WHEN ((R1.ppl_in_WS::FLOAT/R2.totalseat::FLOAT)>0.25) AND ((R1.ppl_in_WS::FLOAT/R2.totalseat::FLOAT) <= 0.4) THEN 2.4 WHEN ((R1.ppl_in_WS::FLOAT/R2.totalseat::FLOAT)>0.4) AND ((R1.ppl_in_WS::FLOAT/R2.totalseat::FLOAT) <= 0.6) THEN 3.6 ELSE 5 END AS crowdednessStatus FROM ( SELECT DISTINCT workspaceid, SUM(H.num_in_out) AS ppl_in_WS FROM hardware H GROUP BY workspaceid) AS R1,( SELECT DISTINCT * FROM workspace WS) AS R2 WHERE R1.workspaceid = R2.workspaceid AND R1.workspaceid = $1 ORDER BY crowdednessStatus ASC",
      [workspaceID]
    );
    console.log(crowdedness.rows);
    res.json(crowdedness.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = route