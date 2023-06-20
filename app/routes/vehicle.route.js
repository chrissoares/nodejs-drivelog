const {authJwt} = require("../middleware");
const vehicle = require("../controllers/vehicle.controller");

module.exports = app => {
    var router = require("express").Router();

    app.use( (req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.route('/adduser')
    .post(
        [authJwt.verifyToken],
        vehicle.addUser
    )

    router.route('/addfueltype')
    .post(
        [authJwt.verifyToken],
        vehicle.addFuelType
    )

    router.route('/:id')
    .get(
        [authJwt.verifyToken],
        vehicle.findOne
    )
    .post(
        [authJwt.verifyToken],
        vehicle.create
    )
    .put(
        [authJwt.verifyToken],
        vehicle.update        
    )
    .delete(
        [authJwt.verifyToken],
        vehicle.delete        
    );

    router.route('/')
    .get(
        [authJwt.verifyToken],
        vehicle.findAll
    )
    .post(
        [authJwt.verifyToken],
        vehicle.create
    );

    app.use("/api/vehicle", router);
}