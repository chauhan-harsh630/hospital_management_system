import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import User from "../models/user.models.js";
import userRouter from "../routers/userRouter.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/hospital_test');
});

afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe("User Registration", () => {
    it("should register a new user successfully", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "patient"
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
        expect(res.body.user.name).toBe("John Doe");
        expect(res.body.user.email).toBe("john@example.com");
    });

    it("should not register user without required fields", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com"
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("All fields are required");
    });

    it("should not register user with duplicate email", async () => {
        await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "patient"
            });

        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "Jane Doe",
                email: "john@example.com",
                password: "password123",
                role: "doctor"
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });

    it("should hash password before saving", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "patient"
            });

        const user = await User.findOne({ email: "john@example.com" });
        expect(user.password).not.toBe("password123");
    });

    it("should validate role enum", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "invalid_role"
            });

        expect(res.status).toBe(500);
    });

    it("should normalize email to lowercase", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "JOHN@EXAMPLE.COM",
                password: "password123",
                role: "patient"
            });

        const user = await User.findOne({ email: "john@example.com" });
        expect(user.email).toBe("john@example.com");
    });
});

describe("User Login", () => {
    beforeEach(async () => {
        await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "patient"
            });
    });

    it("should login user successfully with correct credentials", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "john@example.com",
                password: "password123",
                role: "patient"
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe("john@example.com");
    });

    it("should not login with invalid email", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "nonexistent@example.com",
                password: "password123",
                role: "patient"
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid credentials");
    });

    it("should not login with incorrect password", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "john@example.com",
                password: "wrongpassword",
                role: "patient"
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid credentials");
    });

    it("should not login with incorrect role", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "john@example.com",
                password: "password123",
                role: "doctor"
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid role");
    });

    it("should not login without required fields", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "john@example.com"
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("All fields are required");
    });

    it("should return valid JWT token", async () => {
        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: "john@example.com",
                password: "password123",
                role: "patient"
            });

        expect(res.body.token).toMatch(/^eyJ/);
    });
});

describe("User Model Validation", () => {
    it("should enforce unique email constraint", async () => {
        const user1 = new User({
            name: "John Doe",
            email: "john@example.com",
            password: "hashedpassword",
            role: "patient"
        });

        await user1.save();

        const user2 = new User({
            name: "Jane Doe",
            email: "john@example.com",
            password: "hashedpassword",
            role: "doctor"
        });

        await expect(user2.save()).rejects.toThrow();
    });

    it("should require all fields", async () => {
        const user = new User({
            name: "John Doe",
            role: "patient"
        });

        await expect(user.save()).rejects.toThrow();
    });

    it("should have timestamps", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
                role: "patient"
            });

        const user = await User.findOne({ email: "john@example.com" });
        expect(user.createdAt).toBeDefined();
        expect(user.updatedAt).toBeDefined();
    });
});
