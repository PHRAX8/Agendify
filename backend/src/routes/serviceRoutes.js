import express from "express";
import Service from "../models/Service.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req,res) => {
    try {
        const { title, caption, price, client, paymentMethod } = req.body
        
        if (!title || !caption || !client || !price || !paymentMethod) {
            return res.status(400).json({ message: "Please provide all fields"});
        }
            
        const service = new Service({
            title,
            caption,
            price,
            client,
            paymentMethod,
            user: req.user._id,
        });

        await service.save();

        res.status(201).json(service);

    } catch (error) {
        console.log("Error creating Service", error);
        res.status(500).json({ message: error.message});
    }
});

router.get("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const total = await Service.countDocuments({ user: req.user.id });
        const services = await Service.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username");

        //const totalServices =await Service.countDocuments();

        res.send({
            services,
            currentService: services,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log("Error in get all services route", error);
        res.status(500).json({ message: "Internal server error"});
    }
});

router.get("/user", protectRoute, async (req,res) => {
    try {
        const services = await Service.find({ user: req.user._id }).sort({ createdAt: -1});
        res.json(services);
    } catch (error) {
        console.error("Get user services error:", error.message);
        res.status(500).json({ message: "Server error"});
    }
});

router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if(!service) return res.status(404).json({ message: "Service not found"});

        if (service.user.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Unauthorized"});

        await service.deleteOne();

        res.json({ message: "Service deleted successfully"});
    } catch (error) {
        console.log("Error deleting service", error);
        res.status(500).json({ message: "Internal server error"});
    }
});

export default router;