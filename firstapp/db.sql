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

CREATE TABLE Users(
    email varchar(255) PRIMARY KEY,
    uname varchar(255),
    password varchar(255),
    hasPremium boolean
);

CREATE TABLE Likes(
	FOREIGN KEY (workspace_id) REFERENCES Workspace (workspace_id) ,
	FOREIGN KEY (email) REFERENCES Users (email)
);


-- req.body JSON in postman
{
    "WS_Des" : "such a beautiful place. Full of scumbag",
    "WSName" : "False Coffee",
    "WS_lat" : 13.8798710,
    "WS_long" : 100.9081309,
    "wifi" : false,
    "totalseats" : 180,
    "poweroutlets" : 1
}

{
    email : "aungpyae_official@gmail.com",
    uname : "eieizahahaplus",
    password : "blaballba",
    hasPremium : true
}