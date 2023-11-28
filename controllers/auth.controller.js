/*
There are 3 main functions for Authentication:
- signup: create new User in MongoDB database (role is user if not specifying role)
- signin: find username of the request in database, if it exists,
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
                await user.save().catch(err => {
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


exports.signin = async (req, res) => {
    User.findOne({username: req.body.username}).populate("roles", "-__V").exec(user => {
        if (!user){  // if no user is found, null
            return res.status(404).send({message: "User Not Found."});
        }

        // if user found and successfully populated with "roles" fields
        var passwordIsValid = bcrypt.compareSync(  // compare password in db vs password enetered
            req.body.password,
            user.password
        );

        if (!passwordIsValid){  // wrong password
            return res.status(401).send({message: "Invalid Password"});
        }

        const token = jwt.sign(
            {id: user.id},
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400  // 24 hours
            });
        
        // store all authorized roles of this user for printing later
        var authorities = [];

        for (let i = 0; i < user.roles.length; i++){
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

        req.session.token = token;

        res.status(200).send({  // print user information
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities
        });   
    }).catch(err => {
        res.status(500).send({message: err});
    }); 
};


exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({message: "You've been signed out!"});
    } catch (err) {
        this.next(err);
    }
};