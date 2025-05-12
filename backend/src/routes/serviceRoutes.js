import express from "express";
import Service from "../models/Service.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req,res) => {
    try {
        const { title,description,client,paymentMethod,user} = req.body
        
        if (!title || !description || !client || !paymentMethod || !user) {
            return res.status(400).json({ message: "Please provide all fields"});
        }
            
        const service = new Service({
            title,
            description,
            client,
            paymentMethod,
            user: req.user._id,
        });

        await newService.save();

        res.status(201).json(newService);

    } catch (error) {
        console.log("Error creating Service", error);
        res.status(500).json({ message: error.message});
    }
});

router.post("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const services = await Service.find()
        .sort({ createAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalServices =await Service.countDocuments();

        res.send({
            services,
            currentService: service,
            totalServices,
            totalPages: Math.ceil(totalServices / limit),
        });
    } catch (error) {
        console.log("Error in get all services route", error);
        res.status(500).json({ message: "Internal server error"});
    }
});

export default router;