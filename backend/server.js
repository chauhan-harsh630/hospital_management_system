import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter.js";
import doctorRouter from "./routers/doctotRoute.js";


dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRouter);
const PORT = process.env.PORT || 5000;

app.use("/api", doctorRouter);

mongoose.connect('mongodb://127.0.0.1:27017/hospital_management_system')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
