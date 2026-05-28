import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: String,
        enum: ["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "General Medicine", "Dermatology", "Psychiatry", "Gynecology", "Oncology", "Other"],
        required: true,
        trim: true,
    },
    qualifications: {
        type: [String],
        default: [],
    },
    experienceYears: {
        type: Number,
        default: 0,
        min: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    consultationFee: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;