const express = require('express')
const { pool } = require("./dbConfig");
const route = express.Router()

// create new workspace
route.post("/workspace", async (req, res) => {
    try {
      const wsname = req.query.wsname;
      const ws_des = req.query.ws_des;
      const ws_lat = req.query.ws_lat;
      const ws_long = req.query.ws_long;
      const ws_link = req.query.ws_link;
      const totalseat = req.query.totalseat;
      const wifi = req.query.wifi;
      const poweroutlet = req.query.poweroutlet;
      const newWorkspace = await pool.query(
        "INSERT INTO Workspace (wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi , poweroutlet) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi, poweroutlet]
      );
      console.log(req.query);
    } catch (err) {
      console.error(err.message);
    }
});

// get all workspace
route.get("/workspace", async (req, res) => {
    try {
      const allWorkspace = await pool.query("SELECT * FROM workspace");
      res.json(allWorkspace);
    } catch (err) {
      console.error(err.message);
    }
});

// get all ws_oh
route.get("/ws_oh", async (req, res) => {
    try {
      const allws_oh = await pool.query("SELECT * FROM ws_oh");
      res.json(allws_oh);
    } catch (err) {
      console.error(err.message);
    }
});

// get all ws_menu
route.get("/ws_menu", async (req, res) => {
    try {
      const allws_menu = await pool.query("SELECT * FROM ws_menu");
      res.json(allws_menu);
    } catch (err) {
      console.error(err.message);
    }
});

// get all ws_photo
route.get("/ws_photo", async (req, res) => {
    try {
      const allws_photo = await pool.query("SELECT * FROM ws_photo");
      res.json(allws_photo);
    } catch (err) {
      console.error(err.message);
    }
});

  
//modify a workspace's WSName
route.put("/workspace/wsname/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const { wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi , poweroutlet } = req.query;
        const updateWSName = await pool.query(
        "UPDATE workspace SET WSName = $1 WHERE WorkspaceID = $2",
        [wsname, WorkspaceID]
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
        const { wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi , poweroutlet  } = req.query;
        const updateWS_Des = await pool.query(
        "UPDATE workspace SET WS_Des = $1 WHERE WorkspaceID = $2",
        [ws_des, WorkspaceID]
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
        const { wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi , poweroutlet } = req.query;
        const updateCoor = await pool.query(
        "UPDATE workspace SET WS_lat=$1 and WS_long = $2 WHERE WorkspaceID = $3",
        [ws_lat, ws_long, WorkspaceID]
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
        const { wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi , poweroutlet } = req.query;
        const updateTotalseats = await pool.query(
        "UPDATE workspace SET totalseat = $1 WHERE WorkspaceID = $2",
        [totalseat, WorkspaceID]
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
        const { wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi , poweroutlet } = req.query;
        const updateWifi = await pool.query(
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
        const { wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi , poweroutlet } = req.query;
        const updatePowOL = await pool.query(
        "UPDATE workspace SET poweroutlets = $1 WHERE WorkspaceID = $2",
        [poweroutlet, WorkspaceID]
        );
        res.json("The poweroutlets was updated!");
    } catch (err) {
        console.error(err.message);
    }
});
  
//delete a workspace
route.delete("/workspace/:WorkspaceID", async (req, res) => {
    try {
      const { WorkspaceID } = req.params;
      const deleteWorkspace = await pool.query(
          "DELETE FROM workspace WHERE WorkspaceID = $1", 
          [WorkspaceID]
      );
      res.json("The workspace was deleted!");
    } catch (err) {
      console.log(err.message);
    }
});

// add new photo record to a workspace
route.post("/pic/:WorkspaceID", async (req, res) => {
    try {
    const { WorkspaceID } = req.params;
      const {photo1, photo2, photo3 } = req.query;
      const newMenurec = await pool.query(
        "INSERT INTO ws_photo (photo1, photo2, photo3, WorkspaceID) VALUES($1,$2,$3,$4) RETURNING *",
        [photo1, photo2, photo3, WorkspaceID]
      );
      console.log(req.query);
    } catch (err) {
      console.error(err.message);
    }
});

// update photo1
route.put("/pic/photo1/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {photo1, photo2, photo3 } = req.query;
        const updatephoto1 = await pool.query(
        "UPDATE ws_photo SET photo1 = $1 WHERE WorkspaceID = $2",
        [photo1, WorkspaceID]
        );
        res.json("Photo1 was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update photo2
route.put("/pic/photo2/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {photo1, photo2, photo3 } = req.query;
        const updatephoto2 = await pool.query(
        "UPDATE ws_photo SET photo2 = $1 WHERE WorkspaceID = $2",
        [photo2, WorkspaceID]
        );
        res.json("Photo2 was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update photo3
route.put("/pic/photo3/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {photo1, photo2, photo3 } = req.query;
        const updatephoto3 = await pool.query(
        "UPDATE ws_photo SET photo3 = $1 WHERE WorkspaceID = $2",
        [photo3, WorkspaceID]
        );
        res.json("Photo3 was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// add new menu record to a workspace
route.post("/menu", async (req, res) => {
    try {
      const {menu1, menu2, menu3, WorkspaceID } = req.query;
      const newMenurec = await pool.query(
        "INSERT INTO ws_menu (menu1, menu2, menu3, WorkspaceID) VALUES($1,$2,$3,$4) RETURNING *",
        [menu1, menu2, menu3, WorkspaceID]
      );
      console.log(req.query);
    } catch (err) {
      console.error(err.message);
    }
});

// update menu1
route.put("/pic/menu1/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {menu1, menu2, menu3 } = req.query;
        const updatemenu1 = await pool.query(
        "UPDATE ws_menu SET menu1 = $1 WHERE WorkspaceID = $2",
        [menu1, WorkspaceID]
        );
        res.json("Menu1 was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update menu2
route.put("/pic/menu2/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {menu1, menu2, menu3 } = req.query;
        const updatemenu2 = await pool.query(
        "UPDATE ws_menu SET menu2 = $1 WHERE WorkspaceID = $2",
        [menu2, WorkspaceID]
        );
        res.json("Menu2 was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update menu3
route.put("/pic/menu3/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {menu1, menu2, menu3} = req.query;
        const updatemenu3 = await pool.query(
        "UPDATE ws_menu SET menu3 = $1 WHERE WorkspaceID = $2",
        [menu3, WorkspaceID]
        );
        res.json("Menu3 was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// add new ophours to a workspace
route.post("/ophour", async (req, res) => {
    try {
      const { WorkspaceID , mon , tue , wed , thu , fri , sat , sun } = req.query;
      const newOphour = await pool.query(
        "INSERT INTO ws_oh ( WorkspaceID , mon , tue , wed , thu , fri , sat , sun ) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [ WorkspaceID , mon , tue , wed , thu , fri , sat , sun]
      );
      console.log(req.query);
    } catch (err) {
      console.error(err.message);
    }
});

// update time on monday
route.put("/ophour/mon/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {mon , tue , wed , thu , fri , sat , sun} = req.query;
        const updateOphour = await pool.query(
        "UPDATE ws_oh SET mon = $1 WHERE WorkspaceID = $2",
        [mon, WorkspaceID]
        );
        res.json("Mon Ophour was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update time on tuesday
route.put("/ophour/tue/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {mon , tue , wed , thu , fri , sat , sun} = req.query;
        const updateOphour = await pool.query(
        "UPDATE ws_oh SET tue = $1 WHERE WorkspaceID = $2",
        [tue, WorkspaceID]
        );
        res.json("Tue Ophour was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update time on wednesday
route.put("/ophour/wed/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {mon , tue , wed , thu , fri , sat , sun} = req.query;
        const updateOphour = await pool.query(
        "UPDATE ws_oh SET wed = $1 WHERE WorkspaceID = $2",
        [wed, WorkspaceID]
        );
        res.json("Wed Ophour was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update time on thrusday
route.put("/ophour/thu/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {mon , tue , wed , thu , fri , sat , sun} = req.query;
        const updateOphour = await pool.query(
        "UPDATE ws_oh SET thu = $1 WHERE WorkspaceID = $2",
        [thu, WorkspaceID]
        );
        res.json("Thu Ophour was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update time on friday
route.put("/ophour/fri/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {mon , tue , wed , thu , fri , sat , sun} = req.query;
        const updateOphour = await pool.query(
        "UPDATE ws_oh SET fri = $1 WHERE WorkspaceID = $2",
        [fri, WorkspaceID]
        );
        res.json("Fri Ophour was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update time on saturday
route.put("/ophour/sat/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {mon , tue , wed , thu , fri , sat , sun} = req.query;
        const updateOphour = await pool.query(
        "UPDATE ws_oh SET sat = $1 WHERE WorkspaceID = $2",
        [sat , WorkspaceID]
        );
        res.json("Sat Ophour was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// update time on sunday
route.put("/ophour/sun/:WorkspaceID", async (req, res) => {
    try {
        const { WorkspaceID } = req.params;
        const {mon , tue , wed , thu , fri , sat , sun} = req.query;
        const updateOphour = await pool.query(
        "UPDATE ws_oh SET sun = $1 WHERE WorkspaceID = $2",
        [sun, WorkspaceID]
        );
        res.json("Sun Ophour was updated!");
    } catch (err) {
        console.error(err.message);
    }
});


// get workspaceid from other info
route.get("/workspaceid", async (req, res) => {
    try {
      const wsname = req.query.wsname;
      const ws_des = req.query.ws_des;
      const ws_lat = req.query.ws_lat;
      const ws_long = req.query.ws_long;
      const ws_link = req.query.ws_link;
      const totalseat = req.query.totalseat;
      const wifi = req.query.wifi;
      const poweroutlet = req.query.poweroutlet;
      const newWorkspace = await pool.query(
        "SELECT workspaceid FROM Workspace WHERE wsname = $1 AND ws_des = $2 AND ws_lat = $3 AND ws_long = $4 AND ws_link = $5 AND totalseat = $6 AND wifi = $7 AND poweroutlet = $8",
        [wsname, ws_des, ws_lat, ws_long, ws_link, totalseat, wifi, poweroutlet]
      );
      console.log(req.query);
    } catch (err) {
      console.error(err.message);
    }
});

module.exports = route