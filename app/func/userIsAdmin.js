const rolesVerify = require("../func/rolesVerify");

exports.isAdmin = (userId) => {
    return rolesVerify(userId).isAdmin ? true: null;
}
