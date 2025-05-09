import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
        required: true,
    },
    client:{
        type:String,
        required: true,
    },
    paymentMethod:{
        type:String,
        enum: ['cash', 'credit_card', 'debit_card'],
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, 
    {timestamps: true}
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;