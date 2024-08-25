const User = require ('../models/User');

//Controller to create a new user profile
const createUserProfile = async (req, res) => {
    try{
        //Destructure name, email, password from the request body
        const { name, email, password } = req.body;

        //Create a new user instance
        const user = new User({ name, email, password });

        //Save the user to the database
        const createdUser = await user.save();

        //Send back the created user with a 201 status code
        res.status(201).json(createdUser);

    }catch(error){
        //Handle error and send a 500 status code
        res.status(500).json({ message: error.message });
    }
};

//Controller to retrieve a user profile by ID
const getUserProfileById = async (req, res) => {
    try{
        //Find the user by ID and populate the services field
        const user = await User.findById(req.params.id).populate('services');

        //Check if the user was found
        if(user) {
            res.json(user); // send back the user data
        } else {
            res.status(404).json({ message: 'User not found'}); // Send a 404 if not found
        }

    }catch(error) {
        //Handle errors and send a 500 status code
        res.status(500).json({ message: error.message });
    }
};

//Controller to update an existing user profile
const updateUserProfile = async (req,res ) => {
    try{
        //Destructure name, email and password.
        const { name, email, password } = req.body;

        //Find the user by ID
        const user = await User.findById(req.params.id);

        //Update user details if the user was found
        if (user) {
            user.name = name || user.name ;
            user.email = email || user.email ;
            user.password = password || user.password ;

            //Save the updated user data
            const updatedUser = await user.save();

            //Send back the updated data
            res.json(updatedUser);
        } else {
            res.status(404).json ({ message: 'User not found'});
        }

    }catch(error){
        // Handle errors and send a 500 status code
        res.status(500).json({ message: error.message });

    }
};

// Controller to delete a user profile
const deleteUserProfile = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);

        // Delete the user if found
        if (user) {
            await user.remove();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        // Handle errors and send a 500 status code
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUserProfile,
    getUserProfileById,
    updateUserProfile,
    deleteUserProfile
};