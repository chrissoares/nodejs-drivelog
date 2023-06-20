const rolesVerify = require("../func/rolesVerify");

exports.isModerator = (userId) => {
    return rolesVerify(userId).isModerator ? true: null;
}
