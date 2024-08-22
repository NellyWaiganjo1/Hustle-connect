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

const getServices = async (req,res) => {
    try{
        //Handle search and filter using query parameters
        const keyword = req.query.keyword 
        ? {
            serviceName: {
                $regex: req.query.keyword,
                $options: 'i' // case-insensitive search
            },
        }
        : {};

        const category = req.query.category ? { category: req.query.category } : {};

        // Find services in the database matching the search criteria
        const services = await Service.find({...keyword, ...category }).populate('provider', 'name');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};