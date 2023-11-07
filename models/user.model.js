// create User data model

const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }]
    })
);

module.exports = User;

/*
User object will have a roles array that contains ids in roles collection as reference.

This kind is called Reference Data Models or Normalization. You can find more details at:
MongoDB One-to-Many Relationship tutorial with Mongoose examples
*/


/*
After initializing Mongoose, we don’t need to write CRUD functions because Mongoose supports all of them:

create a new User: object.save()
find a User by id: User.findById(id)
find User by email: User.findOne({ email: … })
find User by username: User.findOne({ username: … })
find all Roles which name in given roles array: Role.find({ name: { $in: roles } })
*/