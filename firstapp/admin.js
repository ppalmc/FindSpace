const express = require('express')
const pool = require("./db")
const route = express.Router()

// create new workspace

route.post("/workspace", async (req, res) => {
    try {
      const { WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets } = req.body;
      const newWorkspace = await pool.query(
        "INSERT INTO Workspace (WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets]
      );
      console.log(req.body);
    } catch (err) {
      console.error(err.message);
    }
  });
  
// show all workspace 
  
route.get("/workspace", async (req, res) => {
    try {
      const allWorkspace = await pool.query("SELECT * FROM workspace");
      res.json(allWorkspace.rows);
    } catch (err) {
      console.error(err.message);
    }
});
  
//get a workspace
  
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

//modify a workspace's WSName
  
route.put("/workspace/workspace/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const { WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets } = req.body;
        const updateWSName = await pool.query(
        "UPDATE workspace SET WSName = $1 WHERE WorkspaceID = $2",
        [WSName, WorkspaceID]
        );
        res.json("The name was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//modify a workspace's WS_Des
  
route.put("/workspace/WS_Des/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const { WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets } = req.body;
        const updateWS_Des = await pool.query(
        "UPDATE workspace SET WS_Des = $1 WHERE WorkspaceID = $2",
        [WS_Des, WorkspaceID]
        );
        res.json("The WS_Des was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//modify a workspace's coordinate
  
route.put("/workspace/coordinate/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const { WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets } = req.body;
        const updateWS_Des = await pool.query(
        "UPDATE workspace SET WS_lat=$1 and WS_long = $2 WHERE WorkspaceID = $3",
        [WS_lat, WS_long, WorkspaceID]
        );
        res.json("The coordinate was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//modify a workspace's totalseats
  
route.put("/workspace/totalseats/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const { WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets } = req.body;
        const updateTotalseats = await pool.query(
        "UPDATE workspace SET totalseats = $1 WHERE WorkspaceID = $2",
        [totalseats, WorkspaceID]
        );
        res.json("The totalseats was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//modify a workspace's wifi
  
route.put("/workspace/wifi/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const { WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets } = req.body;
        const updateWS_Des = await pool.query(
        "UPDATE workspace SET wifi = $1 WHERE WorkspaceID = $2",
        [wifi, WorkspaceID]
        );
        res.json("The wifi status was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

//modify a workspace's poweroutlets
  
route.put("/workspace/poweroutlets/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const { WSName, WS_Des, WS_lat, WS_long, totalseats, wifi , poweroutlets } = req.body;
        const updateWS_Des = await pool.query(
        "UPDATE workspace SET poweroutlets = $1 WHERE WorkspaceID = $2",
        [poweroutlets, WorkspaceID]
        );
        res.json("The poweroutlets was updated!");
    } catch (err) {
        console.error(err.message);
    }
});
  
//delete a workspace
  
route.delete("/workspace/:Workspace_ID", async (req, res) => {
    try {
      const { Workspace_ID } = req.params;
      const deleteWorkspace = await pool.query(
          "DELETE FROM workspace WHERE Workspace_ID = $1", 
          [Workspace_ID]
      );
      res.json("The workspace was deleted!");
    } catch (err) {
      console.log(err.message);
    }
});

// delete old feedback record
route.delete("/givefeedback/:Workspace_ID/:Email", async (req, res) => {
    try {
      const { Workspace_ID } = req.params;
      const deleteWorkspace = await pool.query(
          "DELETE FROM workspace WHERE Workspace_ID = $1", 
          [Workspace_ID]
      );
      res.json("The workspace was deleted!");
    } catch (err) {
      console.log(err.message);
    }
  });

module.exports = route