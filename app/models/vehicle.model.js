module.exports = (sequelize, DataType) => {
    const Vehicle = sequelize.define("vehicles", {
        ownerId: {
            type: DataType.INTEGER
        },
        name: {
            type: DataType.STRING
        },
        manufacturer: {
            type: DataType.STRING
        },
        model: {
            type: DataType.STRING
        },
        color: {
            type: DataType.STRING
        },
        manufactureYear: {
            type: DataType.INTEGER
        },
        modelYear: {
            type: DataType.INTEGER
        },
    });

    return Vehicle;
};