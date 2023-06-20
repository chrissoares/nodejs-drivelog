const rolesVerify = require("../func/rolesVerify");

module.exports = userIsModeratorOrAdmin = async function(userId) {
    const roles = await rolesVerify(userId);
    return roles.isModerator || roles.isAdmin ? true: null;
};
