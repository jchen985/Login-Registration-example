/*
Controller for testing authorization

4 functions:
- /api/test/all for public access
- /api/test/user for logged in user (any role)
- /api/test/mod for moderator users
- /api/test/admin for admin users
*/

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content");
};


exports.userBoard = (req, res) => {
    res.status(200).send("User Content");
};


exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content");
};


exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content");
};