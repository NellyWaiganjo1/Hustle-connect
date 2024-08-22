const Service = require('../models/service');

const createService = async(req, res) => {
    try {
        const { serviceName, description, price, category, location } = req.body;

        //create a new service instance with the provided data
        const service = new Service({
            serviceName,
            description,
            price,
            category,
            location,
            provider : req.user._id, //Link the service to the currently authenticated user
        });

        // save the service to the database
        const createdService = await service.save();
        res.status(201).json(createdService);    
    } catch (error) {
        // handle any errors that occur during service creation
        res.status(500).json({ message: error.message });
    }
};

