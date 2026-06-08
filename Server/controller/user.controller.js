import pool from '../config/db_config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



export const createUser = async (req, res) => {
    const {
        email,
        password,
        role,
        first_name,
        last_name,
        phone
    } = req.body;

    if (
        !email ||
        !password ||
        !role ||
        !first_name ||
        !last_name ||
        !phone
    ) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        const existing = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        const validRoles = ['admin', 'doctor', 'staff', 'patient'];

     if (!validRoles.includes(role)) {
    return res.status(400).json({
        success: false,
        message: 'Invalid role'
    });
     }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            `
            INSERT INTO users
            (
                email,
                password_hash,
                role,
                first_name,
                last_name,
                phone
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, role, first_name, last_name
            `,
            [
                email,
                passwordHash,
                role,
                first_name,
                last_name,
                phone
            ]
        );

        const payload = {
               id: newUser.rows[0].id,
            role: newUser.rows[0].role
         }
        const token = jwt.sign(payload, process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser.rows[0],
            token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};


// Login

export const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(409).json({
            success: false,
            message: "All fields are required"
        });

    }

    try {
        const userResult = await pool.query(
            `SELECT * FROM users WHERE email=$1`, [email.toLowerCase().trim()],
        );
          if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const payload = {
            id: user.id,
            role:user.role
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });


    } catch (error) {
     
          console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    
    }
}

// Logout

export const logoutUser = (req, res) => {
    res.clearCookie("token");

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};