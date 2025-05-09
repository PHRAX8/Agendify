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

export default router;