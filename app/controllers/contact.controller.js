const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");


exports.findAll = async (req, res, next) => {
    let document = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            document = await ContactService.findByName(name);
        }
        else {
            document = await ContactService.find({});
        }
    }
    catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }

    return res.send(document);
};

exports.findOne = async (req, res, next) => {
    try {
        const ContactService =  new ContactService(MongoDB.client);
        const document = await ContactService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    }
    catch (error)  {
        return next(
            new ApiError(
                500, 
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
    // res.send({ message: "findOne handler"});
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0){
        return next(new ApiError(404, "Data to update can not be empty"));
    }

    try {
        const ContactService =  new ContactService(MongoDB.client);
        const document = await ContactService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was update successfully"});
    }
    catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id= ${req.params.id}`)
        );
    }
    // res.send({ message: "update handler"});
};

exports.delete = async (req, res, next) => {
    try {
        const ContactService =  new ContactService(MongoDB.client);
        const document = await ContactService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully"});
    }
    catch (error) {
        return next(
            new ApiError(500, `Error updating contact with id= ${req.params.id}`)
        );
    }
};

exports.deleteAll = async (_req, res, next) => {
    try{
        const ContactService =  new ContactService(MongoDB.client);
        const deletedCount = await ContactService.deleteAll();
        return res.send(
            {
                message: `${deletedCount} contacts were deleted successfully`,
            }
        );

    }
    catch (error){
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
    
};

exports.findAllFavorite = async (_req, res, next) => {
    try{
        const ContactService =  new ContactService(MongoDB.client);
        const documents = await ContactService.findFavorite();
        return res.send(documents);

    } catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving favorite contacts")
        );
    }
    // res.send({ message: "findAllFavorite handler"});
};

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next (new ApiError(400, "Name can not be emty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};