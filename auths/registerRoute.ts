import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import bcrypt from "bcrypt";

import * as dotenv from 'dotenv';
dotenv.config()

const router = express.Router()

router.post("/register", async (req, res) => {
    const { fname, lname, email, password, dateOfBirth, username } = req.body

    const users = await User.find({ email })
    if (users.length) {
        res.status(400).send("A user with this email already exists.")
        return
    }

    const users2 = await User.find({ username });

    if (users2.length) {
        res.status(400).send("A user with this username already exists.")
        return
    }

    let hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 5)

    const newUser = new User({ fname, lname, email, hash, username, dateOfBirth: dateOfBirth.substring(0, 10) })
    // newUser.dateOfBirth instaceof Date;
    const { _id } = await newUser.save()

    const token = jwt.sign({ _id, email }, process.env.JWT_KEY || "")

    res.status(200).json({ token, user: { _id, email, fname, lname, dateOfBirth, username } })
});

export default router;