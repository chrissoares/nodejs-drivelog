const jwt = require("jsonwebtoken");

const config = require("../config/auth.config.development") || false;
if (!config) {
    const config = require("../config/auth.config") || false;
}

const db = require("../models");
const User = db.user;

const {TokenExpiredError} = jwt;

const catchError = (err, res) => {
    if(err instanceof TokenExpiredError) {
        return res.status(401).send({
            message: "Unauthorized! Access token was expired!"
        });
    }
    return res.sendStatus(401).send({
        message: "Unauthorized!"
    });
};

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token){
        return res.status(403).send({
            message: "No token provided!"
        });
    };

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            return catchError(err, res);
        };
        req.userId = decoded.id;
        req.roles = decoded.roles;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId)
    .then(user => {
        user.getRoles()
        .then(roles => {
            for(let i = 0; i< roles.length; i++){
                if(roles[i].name == "admin"){
                    next();
                    return;
                };
            };

            res.status(403).send({
                message: "Require admin role!"
            });
            return;
        });
    });
};

isModerator = (req, res, next) => {
    User.findByPk(req.userId)
    .then(user => {
        user.getRoles()
        .then(roles => {
            for(let i = 0; i < roles.length; i++){
                next();
                return;
            };

            res.status(403).send({
                message: "Require moderator role!"
            });
        });
    });
};

isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId)
    .then(user => {
        user.getRoles()
        .then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "moderator" || roles[i].name === "admin") {
                    next();
                    return;
                }

                // if (roles[i].name === "admin") {
                //     next();
                //     return;
                // }
            }

            res.status(403).send({
                message: "Require Moderator or Admin Role!"
            });
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};

module.exports = authJwt;
