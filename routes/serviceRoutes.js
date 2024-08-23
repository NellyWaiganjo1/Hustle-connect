const express = require('express');
const {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
} = require ("../controllers/serviceController");

const router = express.Router();

// Route for getting all services and creating a new service
router.route('/').get(getServices).post(protect,createService);

//Route for getting, updating and deleting a service by ID
router
    .route('/:id')
    .get(getServiceBYId)
    .put(updateService)
    .delete(deleteService);

    module.exports = router;