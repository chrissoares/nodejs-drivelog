module.exports = (sequelize, DataType) => {
    const Vehicle = sequelize.define("vehicles", {
        name: {
            type: DataType.STRING
        },
        licensePlate: {
            type: DataType.STRING(8),
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