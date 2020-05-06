const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response, next) => {
    try {
        const users = await User.find({}).populate("blogs");
        response.json(users);
    } catch (e) {
        next(e);
    }
});

usersRouter.post("/", async (request, response, next) => {
    if (!request.body.password || request.body.password.length < 3) {
        response
            .status(400)
            .json("Password must be at least 3 characters long")
            .end();
    }
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(
            request.body.password,
            saltRounds
        );

        const newUser = new User({
            username: request.body.username,
            name: request.body.name,
            passwordHash
        });

        const savedUser = await newUser.save();
        response.json(savedUser);
    } catch (e) {
        next(e);
    }
});

module.exports = usersRouter;
