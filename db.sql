CREATE DATABASE findspace;

CREATE TABLE Workspace(
    workspace_id SERIAL PRIMARY KEY,
    WS_Des varchar(255),
    WSName varchar(255),
    WS_lat NUMERIC(10,7),
    WS_long NUMERIC(10,7),
    wifi boolean,
    totalseats INT,
    poweroutlets INT
);




-- req.query JSON in postman
{
    "WS_Des" : "such a beautiful place. Full of scumbag",
    "WSName" : "False Coffee",
    "WS_lat" : 13.8798710,
    "WS_long" : 100.9081309,
    "WS_link" : "Link Krub",
    "wifi" : false,
    "totalseats" : 180,
    "poweroutlets" : 1
}

-- Arrange WS order by crowdednessStatus
SELECT R1.workspaceid, R2.workspaceid,R2.wsname, R2.ws_lat, R2.ws_long, R1.ppl_in_WS, R2.totalseat, R1.ppl_in_WS/R2.totalseat AS crowdedness, R3.photo1, R3.photo2, R3.photo3, R4.feedbacktime, R4.feedbackstatus,
CASE WHEN R1.ppl_in_WS/R2.totalseat<=0.25 THEN 1
WHEN R1.ppl_in_WS/R2.totalseat>0.25 AND R1.ppl_in_WS/R2.totalseat <= 0.4 THEN 2.4
WHEN R1.ppl_in_WS/R2.totalseat>0.4 AND R1.ppl_in_WS/R2.totalseat <= 0.6 THEN 3.6
ELSE 5
END AS crowdednessStatus
FROM ( SELECT DISTINCT workspaceid, SUM(H.num_in_out) AS ppl_in_WS 
	  FROM hardware H 
	  GROUP BY workspaceid) 
	  AS R1,
	  ( SELECT DISTINCT * 
	   FROM workspace WS) AS R2, 
	  ( SELECT DISTINCT * 
	   FROM ws_photo) AS R3,
	   	  ( SELECT DISTINCT * 
	   FROM gives_feedback) AS R4 
WHERE R1.workspaceid = R2.workspaceid AND R1.workspaceid = R3.workspaceid AND R1.workspaceid = R4.workspaceid
ORDER BY crowdednessStatus ASC



-- trigger add to ws_oh
CREATE FUNCTION add_to_wsoh() RETURNS trigger AS $add_to_wsoh$
	BEGIN
		INSERT into ws_oh (workspaceid,mon,tue,wed,thu,fri,sat,sun)
		values (NEW.workspaceid, ' ' , null ,null, null, null, null, null);
        RETURN NEW;
    END;
$add_to_wsoh$ LANGUAGE plpgsql;

CREATE TRIGGER new_workspace_add_oh
AFTER INSERT ON workspace
FOR EACH ROW
EXECUTE PROCEDURE add_to_wsoh();



-- trigger add to ws_menu
CREATE FUNCTION add_to_wsmenu() RETURNS trigger AS $add_to_wsmenu$
	BEGIN
		insert into ws_menu (workspaceid,menu1,menu2,menu3)
		values (NEW.workspaceid, ' ' , null ,null);
                RETURN NEW;
    END;
$add_to_wsmenu$ LANGUAGE plpgsql;

CREATE TRIGGER new_workspace_add_menu
AFTER INSERT ON workspace
FOR EACH ROW
EXECUTE PROCEDURE add_to_wsmenu();



-- trigger add to ws_menu
CREATE FUNCTION add_to_wsphoto() RETURNS trigger AS $add_to_wsphoto$
	BEGIN
		insert into ws_photo (workspaceid,photo1,photo2,photo3)
		values (NEW.workspaceid, ' ' , null ,null);
                RETURN NEW;
    END;
$add_to_wsphoto$ LANGUAGE plpgsql;

CREATE TRIGGER new_workspace_add_photo
AFTER INSERT ON workspace
FOR EACH ROW
EXECUTE PROCEDURE add_to_wsphoto();




INSERT INTO public.workspace(
	wsname, ws_des, poweroutlet, wifi, totalseat, ws_link,  ws_lat, ws_long)
	VALUES ('f', 'f', 45, true, 100, 'kk',  31, 9);