const db = require("../models");
const Op = db.Sequelize.Op;

const FuelType = db.fuelType;

exports.create = (req, res) => {
    if(!req.body.name){
        res.status(400).send({
            code: 1101,
            message: "Fuel type: Name can't be empty."
        });
        return;
    };

    const fuelType = {
        name: req.body.name,
    };

    FuelType.create(fuelType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            req.status(500).send({
                code: 1199,
                message: `Some error occurred while creating fuel type, more information: ${err.message}`
            });
        });
};
    
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.like]: `%${name}%`
        }
    } : null;
    
    FuelType.findAll({
        where: condition
    })
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                code: 1111,
                message: `Cannot find fuel type with name="${name}"`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            code: 1199,
            message: `Some error occurred while retrieving fuel type, more information: ${err.message}`
        });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    FuelType.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    code: 1111,
                    message: `Cannot find fuel type with id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                code: 1199,
                message: `Some error occurred while retrieving fuel type with id=${id}, more information: ${err.message}`
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    FuelType.update(req.body, {
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    code: 2101,
                    message: `Fuel type was updated successfully`
                });
            } else {
                res.status(400).send({
                    code: 1111,
                    message: `Cannot update fuel type with id=${id}. This fuel type was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                code: 1199,
                message: `Some error occurred while updating fuel type with id=${id}, more information: ${err.message}`
            });
        });
};
    
exports.delete = (req, res) => {
    const id = req.params.id;
        
    FuelType.destroy({
        where: {id: id}
    })
    .then(num => {
        if(num == 1){
            res.send({
                code: 2102,
                message: "Fuel type was deleted successfully!"
            });
        } else {
            res.status(400).send({
                code: 1111,
                message: `Cannot delete fuel type with id=${id}. This fuel type was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            code: 1199,
            message: `Some error occurred while deleting fuel type with id=${id}, more information: ${err.message}`
        });
    });
};