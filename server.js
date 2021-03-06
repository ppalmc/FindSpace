const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();
const app = express();

const cors = require("cors");

//link to admin, homepage, wsdetail js file
const admin = require("./admin");
const homepage = require("./homepage");
const wsdetail = require("./wsdetail");

app.use(express.json()); //req.query

//specify the server email
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "prayforchulatinder@gmail.com",
    pass: "chulatinder",
  },
});

const PORT = process.env.PORT || 5678;

const initializePassport = require("./passportConfig");
app.use(cors());

initializePassport(passport);

// Middleware

// Parses details from a form
app.use(express.urlencoded({ extended: true }));
// app.set("view engine", 'ejs');
app.set("view engine", "pug");

app.use("/admin", admin);
app.use("/homepage", homepage);
app.use("/wsdetail", wsdetail);

app.get("/search", async (req, res) => {
  try {
    if (req.query.id != null) {
      const numinout = await pool.query(
        "SELECT wsname, workspaceid FROM workspace WHERE LOWER(wsname) LIKE LOWER('%" +
          req.query.id +
          "%')"
      );
      res.render("test", {
        student: numinout.rows,
      });

      console.log(numinout.rows);
      res.json(numinout.rows);
    } else {
      const numinout = await pool.query(
        "SELECT wsname, workspaceid FROM workspace"
      );
      res.render("test", {
        student: numinout.rows,
      });
      console.log("Query!");
      console.log(numinout.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// update current feedback record
app.put("/gives_feedback/:workspaceID", async (req, res) => {
  try {
    const { workspaceID } = req.params;
    const { feedbacktime, feedbackstatus, email } = req.query;
    const newfeedback = await pool.query(
      "UPDATE gives_feedback SET feedbacktime = $1 , feedbackstatus = $2 , email = $3 WHERE WorkspaceID = $4",
      [feedbacktime, feedbackstatus, email, workspaceID]
    );
    console.log(req.query);
    res.json("OK");
  } catch (err) {
    console.error(err.message);
    res.json("Cannot update feedback");
  }
});

app.get("/subscription", async (req, res) => {
  res.sendFile(__dirname + "/ggPay.html");
});

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: process.env.SESSION_SECRET,
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false,
  })
);
// Funtion inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//app.get("/users/register", checkAuthenticated, (req, res) => {
app.get("/users/register", (req, res) => {
  res.render("register.ejs");
});

// app.get("/users/login", checkAuthenticated, (req, res) => {
app.get("/users/login", (req, res) => {
  res.render("login.ejs");
});

//app.get("/users/forgotPassword", checkAuthenticated, (req, res) => {
app.get("/users/forgotPassword", (req, res) => {
  res.render("forgotPassword.ejs");
});

//app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
app.get("/users/dashboard", (req, res) => {
  let { email } = req.query;
  res.render("dashboard.ejs", { user: email });
});

//app.get("/users/favorite", checkNotAuthenticated, (req, res) => {
app.get("/users/favorite", (req, res) => {
  // var str = '';

  let { email } = req.query;

  //wsID count each id that is in favorite
  let wsID = new Array();
  pool.query(
    `SELECT * FROM public."favorite"
    WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        // throw err;
        res.json("error");
      }
      //change object into value and insert each value into wsID array
      for (i = 0; i < results.rowCount; i++) {
        console.log(i);
        var result = Object.values(results.rows[i]);
        wsID.push(result[1]);
      }
      console.log(wsID);

      //use wsID as an identifier to select the correct instance from workspace db
      // for (z = 0; z < wsID.length; z++) {
      pool.query(
        //select all workspace that has a matching id
        `SELECT * FROM public."workspace"
          WHERE workspaceid = ANY ($1)`,
        [wsID],
        (err, results) => {
          if (err) {
            // throw err;
            res.json("error");
          }
          // for(x = 0; x < results.rowCount; x++){
          //   console.log(x);
          //   var result = Object.values(results.rows[x]);
          //   str = str + '\n'+result[0]+','+result[1]+','+result[2]+','+result[3]+','+result[4]+','+result[5]+','+result[6]+'\n'+'|';
          // }
          // console.log(str);
          res.json(results.rows);
          // res.render("favorite.ejs", { location: results.rows });
        }
      );
      // }
    }
  );
});

//app.get("/users/profile", checkNotAuthenticated, (req, res) => {
app.get("/users/profile", (req, res) => {
  res.render("profile.ejs");
});

//app.get("/users/profileManage/changeEmail", checkNotAuthenticated, (req, res) => {
app.get("/users/profileManage/changeEmail", (req, res) => {
  res.render("profileManage/changeEmail.ejs");
});

app.get("/users/profileManage/changePassword", (req, res) => {
  res.render("profileManage/changePassword.ejs");
});

app.get("/users/profileManage/passwordReset/:email", (req, res) => {
  // console.log(req.isAuthenticated());
  res.render("profileManage/passwordReset.ejs", { email: req.params.email });
});

//app.get("/users/profileManage/changeUsername", checkNotAuthenticated, (req, res) => {
app.get("/users/profileManage/changeUsername", (req, res) => {
  res.render("profileManage/changeUsername.ejs");
});

//app.get("/users/profileManage/changetype", checkNotAuthenticated, (req, res) => {
app.get("/users/profileManage/changetype", (req, res) => {
  res.render("profileManage/changeType.ejs");
});

//app.get("/users/profileManage/deleteUser", checkNotAuthenticated, (req, res) => {
app.get("/users/profileManage/deleteUser", (req, res) => {
  res.render("profileManage/deleteUser.ejs");
});

app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "You have logged out successfully" });
});

//add favorite record
app.post("/users/favorite", async (req, res) => {
  //recieve wsID that needs to be favorite as heart variable
  let { email, heart } = req.query;

  pool.query(
    //insert new worksapce into favorite
    `INSERT INTO public."favorite" (email, workspaceid)
      VALUES ($1, $2)`,
    [email, heart],
    (err, results) => {
      if (err) {
        // throw err;
        res.json("error");
      }
      console.log("reaches here");
      console.log(results);
      res.json("Favorite updated");
      // req.flash("success_msg", "Your favorite place has been updated!");
    }
  );
});

//delete user's favorite record
app.delete("/user/favorite", async (req, res) => {
  try {
    const email = req.query.email;
    const WorkspaceID = req.query.WorkspaceID;
    console.log("req.query");
    console.log(req.query);
    console.log(req.query.email);
    console.log(req.query.WorkspaceID);
    console.log(email);
    console.log(WorkspaceID);

    const deleteFavorite = await pool.query(
      "DELETE FROM favorite WHERE WorkspaceID = $1 AND email = $2",
      [WorkspaceID, email],
      (err, result) => {
        if (err) {
          console.log("err");
          console.log(err);
        }
        console.log("result");
        console.log(result);
      }
    );
    res.json("Favorite record was deleted!");
  } catch (err) {
    console.log(err.message);
    res.json("Cannot delete");
  }
});

app.post("/users/forgotPassword", async (req, res) => {
  let { email } = req.query;
  let errors = [];
  console.log({
    email,
  });
  //validate that the email is valid
  if (!email) {
    errors.push({ message: "Please enter your email" });
  }

  if (errors.length > 0) {
    // res.render("forgotPassword.ejs", { errors, email });
  } else {
    // Validation passed, proceed to send password reset email with link to the reset page.
    transporter.sendMail(
      {
        from: "prayforchulatinder@gmail.com",
        to: email,
        subject: "Findspace Password reset",
        html: `<h1>Click the link below to change your password!</h1><a href="http://localhost:3000/users/profileManage/changePassword/${email}">LINK</a>`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.redirect("/users/login");
        }
      }
    );
  }
});

app.post("/users/profileManage/changePassword", async (req, res) => {
  let { password, password2, email } = req.query;
  let errors = [];

  // console.log({
  //   password,
  //   password2,
  // });
  // //validate that the input is valid
  // if (!password || !password2) {
  //   errors.push({ message: "Please enter all fields" });
  // }

  // if (password.length < 6) {
  //   errors.push({ message: "Password must be a least 6 characters long" });
  // }

  // if (password !== password2) {
  //   errors.push({ message: "Passwords do not match" });
  // }

  if (errors.length > 0) {
    // res.render("profileManage/changePassword.ejs", {
    //   errors,
    //   password,
    //   password2,
    // });
  } else {
    //hash the password
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed

    pool.query(
      //update new password
      `UPDATE public."user"
        SET pwd = $1
        WHERE email = $2`,
      [hashedPassword, email],
      (err, results) => {
        if (err) {
          // throw err;
          res.json("error");
        }
        console.log("reaches here");
        console.log(results);
        res.json("changed");
        // req.flash("success_msg", "Your password has been updated!");
        // res.redirect("/users/profile");
      }
    );
  }
});

app.post("/users/profileManage/passwordReset/", async (req, res) => {
  let { password, password2, email } = req.body;
  let errors = [];
  console.log(email);
  console.log({
    password,
    password2,
  });

  if (!password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    // res.render("profileManage/changePassword.ejs", {
    //   errors,
    //   password,
    //   password2,
    // });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed

    pool.query(
      `UPDATE public."user"
        SET pwd = $1
        WHERE email = $2`,
      [hashedPassword, email],
      (err, results) => {
        if (err) {
          // throw err;
          res.json("error");
        }
        console.log("reaches here");
        console.log(results);
        // req.flash("success_msg", "Your password has been updated!");
        // res.redirect("/users/profile");
      }
    );
  }
});

app.post("/users/profileManage/changeUsername", async (req, res) => {
  let { name, email } = req.query;

  let errors = [];
  console.log({
    name,
  });
  //validate the input
  if (!name) {
    errors.push({ message: "Please enter all fields" });
  }

  if (errors.length > 0) {
    // res.render("profileManage/changeUsername.ejs", { errors, name });
  } else {
    // Validation passed
    pool.query(
      //update name normally
      `UPDATE public."user"
        SET uname = $1
        WHERE email = $2`,
      [name, email],
      (err, results) => {
        if (err) {
          // throw err;
          res.json("error");
        }
        console.log("reaches here");
        console.log(results);
        res.json("Username changed");
        // req.flash("success_msg", "Your username has been updated!");
        // res.redirect("/users/profile");
      }
    );
  }
});

app.post("/users/profileManage/changeEmail", async (req, res) => {
  let { newEmail, email } = req.query;

  let errors = [];
  console.log({
    newEmail,
  });
  //validate the input
  if (!newEmail) {
    errors.push({ message: "Please enter all fields" });
  }

  if (errors.length > 0) {
    // res.render("profileManage/changeEmail.ejs", { errors, email });
  } else {
    // Validation passed
    pool.query(
      //pick the right email to change, since email is a primary key new email cant be the same as an existing email
      `SELECT * FROM public."user"
        WHERE email = $1`,
      [newEmail],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          console.log("Email is already registered");
          // return res.render("profileManage/changeEmail", {
          //   message: "Email already registered",
          // });
        } else {
          //outdated variable, temp is use because when the email is change the passportconfig.js cant update the session user information to match and error happens
          //but since passportconfig is no longer use replacing it with email maybe fine (but im gonna leave it like this)
          let temp = email;
          req.logout();
          pool.query(
            //update email normally
            `UPDATE public."user"
              SET email = $1
              WHERE email = $2`,
            [newEmail, temp],
            (err, results) => {
              if (err) {
                // throw err;
                res.json("error");
              }
              console.log("reaches here");
              console.log(results);
              // req.flash("success_msg", "Your email has been updated!");
              // res.render("index");
            }
          );
        }
      }
    );
  }
});
app.post("/users/profileManage/changeType", async (req, res) => {
  //recieve type of user as string and user email
  let { type, email } = req.query;
  console.log({
    type,
  });
  pool.query(
    `UPDATE public."user"
        SET utype = $1
        WHERE email = $2`,
    [type, email],
    (err, results) => {
      if (err) {
        // throw err;
        res.json("error");
      }
      console.log("reaches here");
      console.log(results);
      req.flash("success_msg", "Your type has been updated!");
      res.redirect("/users/profile");
    }
  );
});

app.post("/users/profileManage/deleteUser", async (req, res) => {
  let { email } = req.query;

  let errors = [];
  console.log({
    email,
  });
  //validation of the inputs
  if (!email) {
    errors.push({ message: "Please enter email" });
  }

  if (errors.length > 0) {
    // res.render("profileManage/deleteUser.ejs", { errors, password });
  } else {
    //validation pass
    req.logout();
    //logout to prevent an error by passportconfig tracking non existing user
    pool.query(
      `DELETE FROM public."user"
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          // throw err;
          res.json("error");
        }
        console.log("reaches here");
        console.log(results);
        res.json("User deleted");
        // req.flash("success_msg", "Your account has been succesfully deleted.");
        // res.render("index");
      }
    );
  }
});

app.post("/users/register", async (req, res) => {
  let { name, email, password, password2 } = req.query;

  let errors = [];

  console.log({
    name,
    email,
    password,
    password2,
  });
  //valition of input
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    // res.render("register", { errors, name, email, password, password2 });
  } else {
    //hash the password
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
      //check all email from all of user to see if one is already registered
      `SELECT * FROM public."user"
        WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);
        //if found
        if (results.rows.length > 0) {
          res.json("Email registered");
          // return res.render("register", {
          //   message: "Email already registered",
          // });
        } else {
          //query insert new user normally with default type of normal user
          pool.query(
            `INSERT INTO public."user" (uname, email, pwd, utype)
                VALUES ($1, $2, $3, $4)
                RETURNING email, pwd`,
            [name, email, hashedPassword, "user"],
            (err, results) => {
              if (err) {
                // throw err;
                res.json("error");
              }
              console.log("reaches here");
              console.log(results.rows);
              // req.flash("success_msg", "You are now registered. Please log in");
              // res.redirect("/users/login");
              res.json("Account Created");
            }
          );
        }
      }
    );
  }
});

app.post("/users/login", async (req, res) => {
  //recieve user input of email and password
  let { email, password } = req.query;
  pool.query(
    //try to find all email that matches the user input
    `SELECT * FROM public."user" WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        // throw err;
        res.json("error");
      }
      console.log(results.rows);
      console.log("");
      //if found the email in db
      if (results.rows.length > 0) {
        const user = results.rows[0];
        //check the password to see if it matches the store hashed password
        bcrypt.compare(password, user.pwd, (err, isMatch) => {
          if (err) {
            res.json("Try again later");
          }
          if (isMatch) {
            //password is correct
            // console.log("results");
            // console.log(results);
            // console.log(results.rows);
            res.json(results.rows);
            // return ("matched");
            //...
          } else {
            //password is incorrect
            res.json("Password incorrect");
            //...
          }
        });
      } else {
        // No user
        console.log("no user found");
        //...
        res.json("No user found");
      }
    }
  );
});

// get status from email

app.get("/premium/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const premiumstatus = await pool.query(
      "SELECT premiumstatus FROM premium WHERE email = $1",
      [email]
    );
    res.json(premiumstatus.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update user status by email

app.put("/premium/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { premiumstatus } = req.query;
    const updatePremiumStatus = await pool.query(
      "UPDATE premium SET premiumstatus = $1 WHERE email = $2",
      [premiumstatus, email]
    );
    res.json("User premiumstatus was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
