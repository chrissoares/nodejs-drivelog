module.exports = {
    secret: "ebc1ffee88aca33d2292f94cd699596d6f81f8d5a1ebe5c49a352d08c566415d",
    /* Production */
    jwtExpiration: 3600, // 1 hour
    jwtRefreshExpiration: 86400, // 24 hours
    /* For Develop */
    jwtExpiration: 120, // 2 minutes
    jwtRefreshExpiration: 300, // 5 minutes
};