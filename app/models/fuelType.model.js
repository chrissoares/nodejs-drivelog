module.exports = (sequelize, DataType) => {
    const FuelType = sequelize.define("fuelTypes", {
        name: {
            type: DataType.STRING
        },
    });

    return FuelType;
};