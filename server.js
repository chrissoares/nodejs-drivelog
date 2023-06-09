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
db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log(`Failed to sync db: ${err.message}`);
    });

// db.sequelize.sync({force: true}).then(() => {
//     initial(db);
//     console.log("Database droped and re-synced.");
// });

//Routes
app.get("/", (req, res) => {
    res.json({message: "Welcome to Drive Log application."});
});

require("./app/routes/auth.route")(app);
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
  