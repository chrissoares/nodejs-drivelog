const db = require("../models");
const User = db.user;

module.exports = (userId) => {
    let userRole = {
        isAdmin: false,
        isModerator: false,
    };

    // const verifyRoles = async function(userId) {
        User.findByPk(userId)
        .then( user => {
            user.getRoles()
            .then(roles => {
                // let userRole = {}
                for (let i = 0; i < roles.length; i++){
                    if(roles[i].name == "admin"){
                        userRole.isAdmin = true;
                    };

                    if(roles[i].name == "moderator"){
                        userRole.isModerator = true;
                    };
                }
            });
        });
    // };

    // return verifyRoles;
    return userRole;
}