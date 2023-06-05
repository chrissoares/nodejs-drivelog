const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.refreshToken = require("./refreshToken.model")(sequelize, Sequelize);

db.fuelType = require("./fuelType.model")(sequelize, Sequelize);
db.vehicle = require("./vehicle.model")(sequelize, Sequelize);
db.refuel = require("./refuel.model")(sequelize, Sequelize);
db.usagePermission = require("./usagePermission.model")(sequelize, Sequelize);
db.usageRecord = require("./usageRecord.model")(sequelize, Sequelize);

// Auth
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.refreshToken.belongsTo(db.user, {
    foreignKey: "userId",
    targetKey: "id"
});

db.user.hasOne(db.refreshToken, {
    foreignKey: "userId",
    targetKey: "id"
});

db.ROLES = ["user", "admin", "moderator"];
console.log(db.vehicle);
// Relationship Fuel Type with Vehicle.
db.vehicle.belongsToMany(db.fuelType, {
    through: "vehicle_fueltype",
    foreignKey: "vehicleId",
    otherKey: "fuelTypeId",
    // as: "fueltypes",
});

db.fuelType.belongsToMany(db.vehicle, {
    through: "vehicle_fueltype",
    foreignKey: "fuelTypeId",
    otherKey: "vehicleId",
    // as: "vehicles",
});

// Relationship Vehicle proprietor
db.vehicle.belongsTo(db.user, {
    foreignKey: "proprietorId",
    as: "users"
});

db.user.hasMany(db.vehicle, {
    as: "vehicles"
});

// Relationship Usage Record
db.usageRecord.belongsTo(db.vehicle, {
    foreignKey: "vehicleId",
    as: "vehicles"
});

db.usageRecord.belongsTo(db.user, {
    foreignKey: "userId",
    as: "users"
});

db.vehicle.hasMany(db.usageRecord, {
    as: "usageRecords"
});

db.user.hasMany(db.usageRecord, {
    as: "usageRecords"
});

// Relationship using Usage Permission
db.user.belongsToMany(db.vehicle, {
    through: db.usagePermission
});

db.vehicle.belongsToMany(db.user, {
    through: db.usagePermission
});

//Relationship Refuel
db.refuel.belongsTo(db.vehicle, {
    foreignKey: "vehicleId",
    as: "vehicles"
});

db.vehicle.hasMany(db.refuel, {
    as: "refuels"
});

db.refuel.belongsTo(db.fuelType, {
    foreignKey: "fuelTypeId",
    as: "fueltypes"
});

db.fuelType.hasMany(db.refuel, {
    as: "refuels"
});

db.refuel.belongsTo(db.user, {
    foreignKey: "userId",
    as: "users"
});

db.user.hasMany(db.refuel, {
    as: "refuels"
});

module.exports = db;