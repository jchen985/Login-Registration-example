/*
to autneticate and authorize, we need:
- check if Token is provided. we get Token from HTTP request session, then use jsonwebtoken's verify()
- check if roles of the user contains required role or not
*/

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const user = db.user;  // user model schema
const Role = db.role;  // role model schema

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token){
        return res.status(403).send({message: "No token provided"});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err){
            return res.status(401).send({message: "Unauthorized"});
        }

        req.userId = decoded.indexOf;
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err){
            res.status(500).send({message: err});
            return;
        }

        Role.find({  // Callback changed
            _id: {$in: user.roles},
        }).exec((err, roles) => {
            if (err){
                res.status(500).send({message: err});
                return;
            }

            for (let i=0; i < roles.length; i++){
                if (roles[i].name === "admin"){
                    next();
                    return;
                }
            }

            res.status(403).send({message: "Require Admin Role!"});
            return;
        });
    });
};

isModerator = (req, res, next) => { 
    User.findById(req.userId).exec((err, user) => {
        if (err){
            res.status(500).send({message: err});
            return;
        }

        Role.find({  // Callback changed
            _id: {$in: user.roles}
        }).exec((err, roles) => {
            if (err){
                res.status(500).send({message: err});
                return;
            }
            
            for (let i=0; i < roles.length; i++){
                if (roles[i].name === "moderator"){
                    next();
                    return;
                }
            }

            res.status(403).send({message: "Require Moderator Role!"});
            return;
        });
    });
};

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
};
module.exports = authJwt;