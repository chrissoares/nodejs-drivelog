module.exports = (sequelize, DataType) => {
    const Refuel = sequelize.define("refuel", {
        when: {
            type: DataType.DATE
        },
        fuelAmount: {
            type: DataType.FLOAT
        },
        unitPrice: {
            type: DataType.FLOAT
        },
        totalPrice: {
            type: DataType.FLOAT
        },
        isFullTank: {
            type: DataType.BOOLEAN
        },
        mileage: {
            type: DataType.FLOAT
        },
    });

    return Refuel;
};