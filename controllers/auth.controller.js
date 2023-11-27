/*
There are 3 main functions for Authentication:
- signup: create new User in MongoDB database (role is user if not specifying role)
- signin:

find username of the request in database, if it exists
compare password with password in database using bcrypt, if it is correct
generate a token using jsonwebtoken
return user information & access Token
- signout: clear current session.
*/

const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');

// sign up a new account
exports.signup = async (req, res) => {
    // create new User db obj 
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8);
    });

    await user.save().then(async user => {
        if (req.body.roles) {  // if new account wants special roles
            Role.find({ name: { $in: req.body.roles } }).then(roles => {
                user.roles = roles.map(role => role._id);  // ????
                await user.save().catch(err => {
                    res.status(500).send({message: err});
                    return;
                })

                res.send({message: "User was registered successfully!"});
            }).catch(err => {
                res.status(500).send({ message: err });
                return;
            });
        }else {  // if new account has now special roles, just asign regular user role
            Role.findOne({name: "user"}).then(role => {
                user.roles = [role._id];
                user.save().catch(err => {
                    res.status(500).send({message: err});
                    return;
                })

                res.send({message: "User was registered successfully!"});
            }).catch(err => {
                res.status(500).send({message: err});
                return;
            })
        }
    }).catch(err => {
        res.status(500).send({message: err});
        return;
    });
};


exports.signin = (req, res) => {

};


exports.signout = async (req, res) => {

};