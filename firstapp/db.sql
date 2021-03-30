CREATE DATABASE findspace;

CREATE TABLE Workspace(
    workspace_id SERIAL PRIMARY KEY,
    location varchar(255),
    sname varchar(255),
    wifi boolean,
    totalSeats INT,
    ophours varchar(255),
    occupiedSeats INT,
    spicture varchar(255),
    menu varchar(255),
    poweroutlets boolean
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
    "location" : "13.790089698,100.98791",
    "sname" : "True false test",
    "wifi" : null,
    "totalseats" : 180,
    "ophours" : null,
    "occupiedseats" : null,
    "spicture" : null,
    "menu" : null,
    "poweroutlets" : null
}

{
    email : "aungpyae_official@gmail.com",
    uname : "eieizahahaplus",
    password : "blaballba",
    hasPremium True
}