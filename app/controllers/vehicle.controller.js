const db = require("../models");
const Op = db.Sequelize.Op;

const Vehicle = db.vehicle;
const User = db.user;
const FuelType = db.fuelType;

const {
    isAdmin,
    isModerator,
    isModeratorOrAdmin
} = require("../func");
const e = require("express");

exports.create = (req, res) => {
    if(!req.body.licensePlate){
        res.status(400).send({
            code: 1201,
            message: "Vehicle: License plate can't be empty."
        });
        return;
    };

    const vehicle = {
        licensePlate: req.body.licensePlate,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        color: req.body.color,
        manufactureYear: req.body.manufactureYear,
        modelYear: req.body.modelYear,
        ownerId: req.userId,
    };

    Vehicle.create(vehicle)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            req.status(500).send({
                code: 2199,
                message: `Some error occurred while creating vehicle, more information: ${err.message}`
            })
        });

};

exports.findAll = async (req, res) => {
    const name = req.query.name;
    let condition = {};

    const seeAll = await isModeratorOrAdmin(req.userId);

    if (!seeAll){
        condition = {
            [Op.or]: [
                {ownerId: req.userId},
                {'$users.id$': req.userId}
            ]
        }
    }

    if (name){
        condition.name = {
            [Op.like]: `%${name}%`
        };
    }

    Vehicle.findAll({
        where: condition,
        include: [
            {
                model: User,
                attributes: []
            },
            {
                model: FuelType,
                attributes: ['id', 'name']
            }
        ],
    })
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            if (name){
                const message = `Cannot find vehicle with name="${name}"`;
            }
            res.status(404).send({
                code: 1211,
                message: `Cannot find vehicle with name="${name}"`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            code: 2199,
            message: `Some error occurred while creating vehicle, more information: ${err.message}`
        });
    });
};

exports.findOne = async (req, res) => {
    const id = req.params.id;

    let condition = {};

    const seeAll = await isModeratorOrAdmin(req.userId);

    if (!seeAll){
        condition = {
            [Op.or]: [
                {ownerId: req.userId},
                {'$users.id$': req.userId}
            ]
        }
    }

    condition.id = id;

    Vehicle.findOne({
        where: condition,
        include: [
            {
                model: User,
                attributes: []
            },
        ],
    }).then(data => {
        if (data){
            res.send(data);
        } else {
            res.status(404).send({
                code: 1212,
                message: `Cannot find vehicle with id=${id}, or not have access to this vehicle.`
            });
        };
    })
    .catch(err => {
        res.status(500).send({
            code: 2199,
            message: `Some error occurred while creating vehicle, more information: ${err.message}`
        });
    });
};

exports.update = async (req, res) => {
    const id = req.params.id;

    let condition = {};
    const conditionUpdate = {
        id: id
    };

    const seeAll = await isModeratorOrAdmin(req.userId);

    if (!seeAll){
        condition = {
            [Op.or]: [
                {ownerId: req.userId},
                {'$users.id$': req.userId}
            ]
        }
    }

    condition.id = id;

    Vehicle.findOne({
        where: condition,
        include: [
            {
                model: User,
                attributes: []
            },
        ],
    }).then(data => {
        if (!data){
            res.status(404).send({
                code: 1212,
                message: `Cannot find vehicle with id=${id}, or not have access to this vehicle.`
            });
        };
    });

    Vehicle.update(req.body, {
        where: conditionUpdate,
    })
    .then(num => {
        if (num == 1) {
            res.send({
                code: 2201,
                message: `Vehicle was updated successfully`
            });
        } else {
            res.status(404).send({
                code: 1221,
                message: `Cannot update vehicle with id=${id}. This vehicle was not found, or not have access to this vehicle!`
            });
        };
    })
    .catch(err => {
        res.status(500).send({
            code: 2199,
            message: `Some error occurred while creating vehicle, more information: ${err.message}`
        });
    });
};

exports.delete = async (req, res) => {
    const id = req.params.id;

    let condition = {};
    const conditionDelete = {
        id: id
    };

    const seeAll = await isModeratorOrAdmin(req.userId);

    if (!seeAll){
        condition = {
            [Op.or]: [
                {ownerId: req.userId},
                {'$users.id$': req.userId}
            ]
        }
    }

    condition.id = id;

    Vehicle.findOne({
        where: condition,
        include: [
            {
                model: User,
                attributes: []
            },
        ],
    }).then(data => {
        if (!data){
            res.status(404).send({
                code: 1212,
                message: `Cannot find vehicle with id=${id}, or not have access to this vehicle.`
            });
        };
    });

    Vehicle.destroy({
        where: conditionDelete,
    })
    .then(num => {
        if(num == 1){
            res.send({
                code: 2202,
                message: "Vehicle was deleted successfully!"
            });
        } else {
            res.status(404).send({
                code: 1212,
                message: `Cannot delete vehicle with id=${id}. This vehicle was not found, or not have access to this vehicle!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            code: 2199,
            message: `Some error occurred while creating vehicle, more information: ${err.message}`
        });
    });
};

exports.addUser = async (req, res) => {
    const userId = req.body.userId;
    const vehicleId = req.body.vehicleId;

    let condition = {};

    const seeAll = await isModeratorOrAdmin(req.userId);

    if (!seeAll){
        condition = {
            [Op.or]: [
                {ownerId: req.userId},
                {'$users.id$': req.userId}
            ]
        }
    }

    condition.id = vehicleId;

    Vehicle.findOne({
        include:[
            {
                model: User,
            }
        ],
        where: condition

    })
    .then(vehicle => {
        User.findByPk(userId)
        .then(user => {
            if (!user) {
                res.status(400).send({
                    code: 1511,
                    message: `Cannot find the user with id ${userId}, to add in the vehicle permissions.`
                });
            };

            vehicle.addUser(user)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    code: 1299,
                    message: `Some error occurred while adding user in vehicle permissions, more information: ${err.message}`
                })
            })
        })
    })
    .catch(err => {
        res.status(500).send({
            code: 1299,
            message: `Some error occurred while adding user in vehicle permissions, more information: ${err.message}`
        });
    });
};

exports.addFuelType = async (req, res) => {
    const vehicleId = req.body.vehicleId;
    const fuelTypeId = req.body.fuelTypeId;

    let condition = {};

    const seeAll = await isModeratorOrAdmin(req.userId);

    if (!seeAll){
        condition = {
            [Op.or]: [
                {ownerId: req.userId},
                {'$users.id$': req.userId}
            ]
        }
    }

    condition.id = vehicleId;

    Vehicle.findOne({
        include:[
            {
                model: User,
            }
        ],
        where: condition
    })
    .then(vehicle => {
        FuelType.findByPk(fuelTypeId)
        .then(fueltype => {
            if (!fueltype){
                res.status(400).send({
                    code: 1111,
                    message: `Cannot find the fuel type with id ${fuelTypeId}, to add fuel types accepted by vehicle.`
                });
            };

            vehicle.addFuelType(fueltype)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    code: 1299,
                    message: `Some error occurred while adding fuel type in vehicle accepted fuel types, more information: ${err.message}`
                });
            });
        });
    })
    .catch(err => {
        res.status(500).send({
            code: 1299,
            message: `Some error occurred while adding fuel type in vehicle accepted fuel types, more information: ${err.message}`
        });
    });
}
