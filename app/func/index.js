const isAdmin = require("./userIsAdmin");
const isModerator = require("./userIsModerator");
const isModeratorOrAdmin = require("./userIsModeratorOrAdmin");

const userRoles = {
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
}

module.exports = userRoles;
