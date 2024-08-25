const express = require('express');
const router = express.Router();

// Import controllers for user profile management
const {
    createUserProfile,
    getUserProfileById,
    updateUserProfile,
    deleteUserProfile
} = require('../controllers/userController');

// POST route to create a new user profile
router.post('/', createUserProfile);

// GET route to retrieve a user profile by ID
router.get('/:id', getUserProfileById);

// PUT route to update a user profile by ID
router.put('/:id', updateUserProfile);

// DELETE route to remove a user profile by ID
router.delete('/:id', deleteUserProfile);

module.exports = router;