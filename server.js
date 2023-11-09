const express = require("express");
const cors = require("cors");
const cookieSesson = require("cookie-session");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(
    cookieSesson({
        name: "jianan-session",
        keys: ["COOKIE_SECRET"], // should use as secret environment variable
        httpOnly: true
    })
);

// open Mongoose connection to MongoDB database
const db = require("./models/index");  // db is an object that constains the Role and User collection 
const dbConfig = require("./config/db.config");
const Role = db.role;

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`).then(() => {
    console.log("Successfully connected to MongoDB");
    initial();
}).catch(err => {
    console.error("Connection error: ", err);
    process.exit();
});


/* 
create 3 rows in roles collection
"user", "moderator", "admin"
*/
async function initial() {

    await Role.estimatedDocumentCount().then((count) => {

        console.log(count);
        if (count === 0){
            new Role({
                name: "user"
            }).save().then(() => {
                console.log("added 'user' to Role collection");
            }).catch(err => {
                console.error("error", err);
            });

            new Role({
                name: "moderator"
            }).save().then(() => {
                console.log("added 'moderator' to Role collection");
            }).catch(err => {
                console.error("error", err);
            });

            new Role({
                name: "admin"
            }).save().then(() => {
                console.log("added 'admin' to Role collection");
            }).catch(err => {
                console.error("error", err);
            });
        }

    }).catch(err => {
        console.error("Estimate Doc Count error: ", err);
        // process.exit();
    });

}

//simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to Jianan application."});
})

//set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})