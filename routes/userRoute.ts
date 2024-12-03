import express from "express";
import User from "../models/User";

const router = express.Router();

router.get("/username", async (req, res) => {
    const { username } = req.query;

    if (!username || username == undefined || (username as String).length < 3) {
        res.status(400).send("Username is too short")
        return
    }

    const users = await User.find({ username });

    if (users.length) {
        res.status(400).send("Username is already taken")
        return
    }

    res.status(200).send("OK");
})

export default router;