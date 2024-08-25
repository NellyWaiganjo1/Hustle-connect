const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');
const auth = require('../middleware/auth')

// Public routes
router.post('/register',
    [
        body('name').not().isEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ],
    userController.register
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').exists().withMessage('Password is required')
    ],
    userController.login
);

// Protected routes
router.get('/profile', userController.getAllUserProfiles);  
router.get('/profile/:id', auth, userController.getUserProfile);
router.put('/profile/:id', auth, userController.updateUserProfile)
router.delete('/profile/:id', auth, userController.deleteUser);


module.exports = router;