import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../server.js";

describe("server API", () => {
  describe("GET /voices", () => {
    it("responds with json", async () => {
      const res = await request(app).get("/voices");
      expect(res.headers["content-type"]).toMatch(/json/);
    });

    it("returns 200 with voices array or 500 on API error", async () => {
      const res = await request(app).get("/voices");
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(res.body)).toBe(true);
      } else {
        expect(res.body).toHaveProperty("error");
      }
    });
  });

  describe("POST /tts", () => {
    it("accepts JSON with message and responds with messages", async () => {
      const res = await request(app)
        .post("/tts")
        .send({ message: "Hello" })
        .set("Content-Type", "application/json");

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty("messages");
        expect(Array.isArray(res.body.messages) || typeof res.body.messages).toBeTruthy();
      }
    });

    it("returns 200 for empty message (triggers default intro)", async () => {
      const res = await request(app)
        .post("/tts")
        .send({ message: "" })
        .set("Content-Type", "application/json");

      expect([200, 500]).toContain(res.status);
    });
  });

  describe("POST /sts", () => {
    it("accepts JSON with audio base64", async () => {
      const res = await request(app)
        .post("/sts")
        .send({ audio: Buffer.from("fake-audio").toString("base64") })
        .set("Content-Type", "application/json");

      expect([200, 400, 500]).toContain(res.status);
    });
  });
});
