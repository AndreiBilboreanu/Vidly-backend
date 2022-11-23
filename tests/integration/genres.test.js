const { User } = require("../../models/user");
const { Genres } = require("../../models/genre");
const request = require("supertest");
const mongoose = require("mongoose");
let server;

describe("/app/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genres.remove({});
  });

  describe("GET / ", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "genres1" },
        { name: "genres2" },
        { name: "genres3" },
      ]);
      const res = await request(server).get("/app/genres/");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((g) => g.name === "genres1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genres2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre by id ", async () => {
      const genre = new Genres({ name: "Action" });
      await genre.save();
      const res = await request(server).get("/app/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if invalid id passed ", async () => {
      const res = await request(server).get("/app/genres/1");
      expect(res.status).toBe(404);
    });
    it("should return 404 if no genre with the given id exist ", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/app/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/app/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 caracters", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if genre is more than 50 caracters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should save genre if it is valid", async () => {
      await exec();

      const genre = Genres.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
    it("should return the genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
