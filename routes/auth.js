var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcrypt");

router.post("/Register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
      profilePic: req.body.profilePic
    }
    if (!user_details.username || !user_details.firstname || !user_details.lastname ||
      !user_details.country || !user_details.password || !user_details.email || !user_details.profilePic){
        //if at least one of the arguments is null
        throw { status: 400, message: "Missing parameters" };
      }
    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users (username, firstname, lastname, country, password, email, imgurl) VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}','${user_details.country}', '${hash_password}', '${user_details.email}', '${user_details.profilePic}')` 
    );
    res.status(201).send({ message: "The user has created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    if (!req.body.username || !req.body.password){
      throw { status: 400, message: "Missing Username or Password" };
    }
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(`SELECT * FROM users WHERE username = '${req.body.username}'`))[0];
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }
    // Set cookie
    req.session.user_id = user.user_id;
    // return cookie
    res.status(201).send({ message: "Login Succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res, next) {
  try {
    if(req.session.user_id==undefined)
    throw { status: 401, message: "You must Log-In before you can Log-Out" };
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "Logout Succeeded" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;