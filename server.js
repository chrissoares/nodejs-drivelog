const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");

if (!dbConfig.recreate){
    db.sequelize.sync()
        .then(() => {
            console.log("Synced db.");
        })
        .catch((err) => {
            console.log(`Failed to sync db: ${err.message}`);
        });
} else {
    db.sequelize.sync({force: true}).then(() => {
        initial(db);
        initialForTest(db);
        console.log("Database droped and re-synced.");
    });
};


//Routes
app.get("/", (req, res) => {
    res.json({message: "Welcome to Drive Log application."});
});

require("./app/routes/auth.route")(app);
require("./app/routes/vehicle.route")(app);
require("./app/routes/fuelType.route")(app);


//Start App
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// TODO: Tabela com Locais

function initial(db) {
    const Role = db.role;
    //Initial data
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
}

function initialForTest(db) {
    var bcrypt = require("bcryptjs");
    const User = db.user;
    //Initial data for tests
    User.create({
        username: "admin",
        email: "admin@teste.com",
        password: bcrypt.hashSync("123456", 8),
        roles: ["admin","moderator", "user"],
    });
   
    User.create({
        username: "moderador",
        email: "moderator@teste.com",
        password: bcrypt.hashSync("123456", 8),
        roles: ["moderator", "user"],
    });
   
    User.create({
        username: "usuario",
        email: "user@teste.com",
        password: bcrypt.hashSync("123456", 8),
        roles: ["user"],
    });
    User.create({
        username: "usuario2",
        email: "user@teste.com",
        password: bcrypt.hashSync("123456", 8),
        roles: ["user"],
    });
    User.create({
        username: "usuario3",
        email: "user@teste.com",
        password: bcrypt.hashSync("123456", 8),
        roles: ["user"],
    });
    User.create({
        username: "usuario4",
        email: "user@teste.com",
        password: bcrypt.hashSync("123456", 8),
        roles: ["user"],
    });

    const FuelType = db.fuelType;
    FuelType.create({
        name: "Gasolina",
    });
    
    FuelType.create({
        name: "Etanol",
    });
    
    FuelType.create({
        name: "Diesel",
    });
    
    FuelType.create({
        name: "GNV",
    });
}
  