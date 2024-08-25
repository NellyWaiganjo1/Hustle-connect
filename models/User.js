const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['client', 'service_provider', 'admin'],
        default: 'client',
    },
    profile: {
        type: String,
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    }],
},{
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
