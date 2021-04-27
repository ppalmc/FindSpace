const express = require('express')
const app = express()
const pool = require("./db")
const route = express.Router()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server)


// get request for display WS in recommended order
route.get('/recommWS', async (req,res) => {
    try {
        const current_lat = req.params.Lat;
        const current_long = req.params.Long;
        const inrangeWS = []
        const allWorkspace = await (await pool.query("SELECT R1.workspaceid, R2.workspaceid,R2.wsname, R2.ws_lat, R2.ws_long, R1.ppl_in_WS, R2.totalseat, R1.ppl_in_WS/R2.totalseat AS crowdedness, R3.photo1, R3.photo2, R3.photo3, R4.feedbacktime, R4.feedbackstatus, CASE WHEN R1.ppl_in_WS/R2.totalseat<=0.25 THEN 1 WHEN R1.ppl_in_WS/R2.totalseat>0.25 AND R1.ppl_in_WS/R2.totalseat <= 0.5 THEN 3 ELSE 5 END AS crowdednessStatus FROM ( SELECT DISTINCT workspaceid, SUM(H.num_in_out) AS ppl_in_WS FROM hardware H GROUP BY workspaceid) AS R1, ( SELECT DISTINCT * FROM workspace WS) AS R2, ( SELECT DISTINCT * FROM ws_photo) AS R3,( SELECT DISTINCT * FROM gives_feedback) AS R4 WHERE R1.workspaceid = R2.workspaceid AND R1.workspaceid = R3.workspaceid AND R1.workspaceid = R4.workspaceid ORDER BY crowdednessStatus ASC")).rows
        for (i in allWorkspace) {
            distance = measure(allWorkspace[i].ws_lat,allWorkspace[i].ws_long,current_lat,current_long)
            if (distance <= 500) {
                allWorkspace[i]['distance'] = distance
                inrangeWS.push(allWorkspace[i])
            }
        }
        for (i in inrangeWS) {
            inrangeWS[i]['score'] = inrangeWS[i].distance * inrangeWS[i].crowdednessstatus
        }
        sortJSON(inrangeWS,'score',true)
        res.json(inrangeWS)
    } catch (err) {
        console.error(err.message);
    }
})


function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

function sortJSON(arr, key, asc) {
    return arr.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (asc == true) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        else { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

// no needs to send http request every 2 seconds (may cause delay)
// https://stackoverflow.com/questions/35024814/nodejs-auto-refresh-view-after-database-updates

module.exports = route