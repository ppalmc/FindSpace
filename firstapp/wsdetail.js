const express = require('express')
const app = express()
const pool = require("./db")
const route = express.Router()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)


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


module.exports = route