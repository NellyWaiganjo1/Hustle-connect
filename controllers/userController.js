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