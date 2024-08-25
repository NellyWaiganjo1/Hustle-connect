const express = require('express');
const router = express.Router();

// Import controllers for user profile management
const {
    createUserProfile,
    getUserProfileById,
    updateUserProfile,
    deleteUserProfile
} = require('../controllers/userController');

