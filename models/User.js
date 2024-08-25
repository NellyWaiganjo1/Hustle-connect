const mongoose = require('mongoose');

//Define Schema for user.
const userSchema = new mongoose.Schema({
    //user's name
    name: {
        type: String,
        required: true
    },
    // user's email(must be unique)
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // user's password
    password: {
        type: String,
        required: true,
    },
    // Array of services provided by the user, referenced from Service model
    services: [
        {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Service'
        }
        ] // Link to services
},
{ timestamps: true }
);
// Create the user model using the schema
const User = mongoose.model('User',userSchema);

module.exports = User;