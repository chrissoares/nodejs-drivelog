const db = require("../models");

//todo: create a way to not repeat this. Is using in refreshToken.model.js and
// authJwt.js
const config = require("../config/auth.config.development") || false;
if (!config) {
    const config = require("../config/auth.config") || false;
}

const {
    user: User,
    role: Role,
    refreshToken: RefreshToken
} = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    .then(user => {
        if(req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            })
            .then(roles => {
                user.setRoles(roles)
                .then(() => {
                    res.send({
                        message: "User was registered successfully!"
                    });
                });
            });
        } else {
            user.setRoles([1])
            .then(() => {
                res.send({
                    message: "User was registered successfully!"
                });
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(async (user) => {
        if(!user){
            return res.status(404).send({
                message: "User not found."
            });
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if(!passwordIsValid){
            return res.status(401).send({
                accessToken: null,
                message: "Invalid password!"
            });
        };

        let refreshToken = await RefreshToken.createToken(user);

        let authorities = [];
        let userRoles = [];
        user.getRoles()
            .then(roles => {
                for(let i = 0; i< roles.length; i++){
                    authorities.push(`ROLE_${roles[i].name.toUpperCase()}`);
                    userRoles.push(roles[i].name);
                };
                var token = jwt.sign(
                    {
                        id: user.id,
                        roles: userRoles
                    },
                    config.secret,
                    {
                        expiresIn: config.jwtExpiration
                    }
                );
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                });
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
    });
};

exports.refreshToken = async (req, res) => {
    const {refreshToken: requestToken} = req.body;
    
    if (requestToken == null){
        return res.status(403).send({
            message: "Refresh token is required!"
        });
    };

    try {
        let refreshToken = await RefreshToken.findOne({
            where: {
                token: requestToken
            }
        });

        if(!refreshToken){
            res.status(403).send({
                message: "Refresh token is not in database!"
            });
            return;
        };

        if(RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({
                where: {
                    id: refreshToken.id
                }
            });

            res.status(403).send({
                message: "Refresh token was expired. Please make a new signin"
            });
            return;
        };

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign(
            {
                id: user.id
            },
            config.secret,
            {
                expiresIn: config.jwtExpiration
            }
        );

        return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({
            message: err.message
        });
    };
};
