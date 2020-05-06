const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url:
            "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
];

test("blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");
    const content = response.body.map(b => b.title);

    expect(content).toContain("Go To Statement Considered Harmful");
});

test("a valid blog can be added", async () => {
    const newBlog = {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url:
            "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201);

    const response = await api.get("/api/blogs");
    const contents = response.body.map(b => b.title);

    expect(response.body.length).toBe(initialBlogs.length + 1);
    expect(contents).toContain("TDD harms architecture");
});

test("a unique identifier is named 'id'", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0]["id"]).toBeDefined();
});

test("that likes property will default to 0", async () => {
    const newBlog = {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url:
            "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
    };
    const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201);
    expect(response.body.likes).toBe(0);
});

test("that request missing url or title will fail with 400 status code", async () => {
    const newBlog = {
        author: "Robert C. Martin"
    };

    const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400);
});

test("a blog gets deleted", async () => {
    await api.delete("/api/blogs/" + initialBlogs[0]["_id"]).expect(204);

    const response = await api.get("/api/blogs");

    expect(response.body.length).toBe(1);
});

test("likes get updated", async () => {
    const blog = { ...initialBlogs[0], likes: 42 };
    const response = await api.put("/api/blogs/" + blog["_id"]).send(blog);

    expect(response.body.likes).toBe(42);
});

beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();

    blogObject = new Blog(initialBlogs[1]);
    await blogObject.save();
});

afterAll(() => {
    mongoose.connection.close();
});
