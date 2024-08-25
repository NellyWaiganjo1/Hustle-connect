const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role = 'client', profile, bio, location, services, ratings } = req.body;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance with the hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            profile,
            bio,
            location,
            services,
            ratings
        });
        
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: newUser.name,
                email: newUser.email,
                id: newUser._id,
                role: newUser.role,
                profile: newUser.profile,
                bio: newUser.bio,
                location: newUser.location,
                services: newUser.services,
                ratings: newUser.ratings,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'User registration failed', details: err.message });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) {
                console.log('JWT error:', err);
                throw err;
            }
            res.json({ token });
        });
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllUserProfiles = async (req, res) => {
    try {
        const users = await User.find(); // Get all users
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user profiles', details: err.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        // Check if the requested user profile matches the authenticated user or if the requesting user is an admin
        if (req.params.id && req.user.id !== req.params.id) {

            return res.status(403).json({ error: 'Not authorized to view this profile' });
        }

        const user = await User.findById(req.params.id || req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user profile', details: err.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, profile, bio, location } = req.body;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the email is being updated and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
            user.email = email;
        }

        // Update fields
        if (name) user.name = name;
        if (profile) user.profile = profile;
        if (bio) user.bio = bio;
        if (location) user.location = location;

        // Handle password update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save the updated user
        await user.save();

        res.json({
            message: 'User profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
                profile: user.profile,
                bio: user.bio,
                location: user.location,
                id: user._id
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user profile', details: err.message });
    }
};
