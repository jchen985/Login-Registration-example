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


//simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to Jianan application."});
})

//set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})