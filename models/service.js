const mongoose = require ('mongoose');

const serviceSchema = mongoose.Schema(
    {
        // Name of the service
        serviceName: {
            type: String,
            required: true,
        },
        //description of the service
        description:  {
            type: String,
            required: true,
        },
        //price for the service
        price: {
            type: Number,
            required: true,
        },
        // reference to the user providing the service (an objectId linked to the user model)
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // category of the service (plumbing, carpentry)
        category: {
            type: String,
            required: true,
        },
        // Location where the service is provided
        location: {
            type: String,
            required: true,
        },

        // Ratings for the service, an array of user ratings
        ratings: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                },
            }
        ],
    },

    {
        // Automatically add createAt and updateAt fields
        timestamps: true,
    }
);

    // Create the service model using the schema
    const Service = mongoose.model('Service', serviceSchema);

    module.exports  = Service;
    
