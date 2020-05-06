const User = require("../models/user");

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("when there is only one user in db", () => {
    beforeEach(async () => {
        try {
            await User.deleteMany({});
            const user = new User({ username: "root", passwordHash: "secret" });
            await user.save();
        } catch (e) {
            console.log(e);
        }
    });

    test("getting all users", async () => {
        const result = await api.get("/api/users").expect(200);
        const users = result.body.map(u => u.username);
        expect(users).toContain("root");
    });

    test("creating a user with a new username", async () => {
        const newUser = { username: "haris", password: "secret" };
        await api
            .post("/api/users")
            .send(newUser)
            .expect(200);

        const result = await api.get("/api/users").expect(200);
        const users = result.body.map(u => u.username);
        expect(users).toContain(newUser.username);
    });

    test("creating a user with existing username fails", async () => {
        const newUser = { username: "root", password: "secret" };
        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400);

        expect(response.body).toContain(
            "User validation failed: username: Error, expected `username` to be unique. Value: `root`"
        );
    });

    test("creating a user with too short password fails", async () => {
        const newUser = { username: "root", password: "se" };
        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(400);

        expect(response.body).toContain(
            "Password must be at least 3 characters long"
        );
    });
});

afterAll(() => {
    mongoose.connection.close();
});
