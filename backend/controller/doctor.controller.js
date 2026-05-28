import Doctor from "../models/docter.models.js";

export const createDoctorProfile = async (req, res) => {
    try {
        const { specialization, department, qualifications, experienceYears = 0, consultationFee } = req.body;
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        }

        const existingDoctor = await Doctor.findOne({ userId });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor profile already exists for this user." });
        }

        const doctor = await Doctor.create({
            userId,
            specialization,
            department,
            qualifications,
            experienceYears,
            consultationFee,
        });

        return res.status(201).json({
            message: "Doctor profile created successfully.",
            doctor
        });
    } catch (error) {
        return res.status(500).json({ message: "Error creating doctor profile.", error: error.message });
    }
};




 export const getDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token" });
        };
        const doctor = await Doctor.findOne({ userId }).populate("userId", "name email");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found." });
        }
        return res.status(200).json({ doctor });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching doctor profile.", error: error.message });
    }
}                           

