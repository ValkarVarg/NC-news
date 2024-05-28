const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("general api errors", () => {
  test("returns a 404 Not Found when an invalid endpoint is requested", () => {
    return request(app)
      .get("/api/invalidendpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET:200 responds with an objects describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body}) => {
        for (const endpointName in body.endpoints) {
          const endpoint = body.endpoints[endpointName]
          expect(typeof endpoint.description).toBe("string");
          if(endpoint.exampleResponse) {expect(typeof endpoint.exampleResponse).toBe("object");}
          if(endpoint.queries) {expect(typeof endpoint.queries).toBe("object");}
          if(endpoint.bodyFormat) {expect(typeof endpoint.bodyFormat).toBe("object")}
          }
        });
      });
  });
