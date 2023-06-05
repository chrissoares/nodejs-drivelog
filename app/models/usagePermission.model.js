module.exports = (sequelize, DataType) => {
    const UsagePermission = sequelize.define("usagePermissions", {
        isAdmin: {
            type: DataType.BOOLEAN
        },
    });

    return UsagePermission;
};
