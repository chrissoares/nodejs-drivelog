module.exports = (sequelize, DataType) => {
    const UsageRecord = sequelize.define("usageRecords", {
        initialMileage: {
            type: DataType.INTEGER
        },
        finalMileage: {
            type: DataType.INTEGER
        },
        when: {
            type: DataType.DATE
        },
    });

    return UsageRecord;
};

