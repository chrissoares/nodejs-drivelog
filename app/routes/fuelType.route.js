const {authJwt} = require("../middleware");
const fuelType = require("../controllers/fuelType.controller");

module.exports = app => {
    var router = require("express").Router();
    // var publicRoutes = require("express").Router();
    app.use( (req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.route('/')
    .get(
        [authJwt.verifyToken],
        fuelType.findAll
    )
    .post(
        [
            authJwt.verifyToken,
            authJwt.isModeratorOrAdmin
        ],
        fuelType.create
    )
    
    router.route('/:id')
    .get(
        [authJwt.verifyToken],
        fuelType.findOne
    )
    .put(
        [
            authJwt.verifyToken,
            authJwt.isModeratorOrAdmin
        ],
        fuelType.update
    )
    .delete(
        [
            authJwt.verifyToken,
            authJwt.isModeratorOrAdmin
        ],
        fuelType.delete
    )
    
    app.use("/api/fueltype", router);
}