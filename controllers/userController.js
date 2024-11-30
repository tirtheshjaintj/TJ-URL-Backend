const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const { setUser } = require("../services/auth");


const Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg});
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("name email password"); // Include password for matchPassword
        if (!user) return res.status(401).json({ error: "Wrong Credentials Please Check" });
        const isMatch = await user.matchPassword(password); // Assuming matchPassword is a method on the user schema
        if (isMatch) {
            const token = setUser({email:user.email,id:user._id});
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ error: "Wrong Credentials Please Check" });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Something went Wrong" });
    }
};

const Signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(401).json({ error: "Sorry, User Already Exists" });
        const newUser = await User.create({ name, email, password });
        const id = newUser._id;
        const token = setUser({ email: newUser.email, name: newUser.name,id});
        return res.status(201).json({ token });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Something went Wrong" });
    }
};

const google_login = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, message: errors.array()[0].msg });
    }
    const { email, google_id, name } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({email});
        const password = Math.random().toString(36).slice(-8); // Random strong password of length 8
        console.log(password);
        if (!user) {
            user = await User.create({
                name,
                email,
                google_id,
                password
         });
           
        } else {
            // If the user exists, validate Google ID
            if (user.google_id && user.google_id !== google_id) {
                return res.status(400).json({ status: false, message: 'Invalid Google ID' });
            }
            user.google_id = google_id;
            await user.save();
        }
        

        // Generate JWT token for the user
        const token = setUser(user);
        // Respond with success
        return res.status(200).json({ status: true, message: 'Login successful!', token });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Wrong Credentials Please Check" });
        const userData = await User.findById(user.user._id).select("name email");
        console.log("userData",userData);
        return res.status(200).json(userData);
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({ error: "Something went Wrong" });
    }
};

const editUser = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const updates = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("name email");
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Edit user error:", error);
        return res.status(500).json({ error: "Something went Wrong" });
    }
};

module.exports = { Login, Signup, getUser, editUser, google_login};
