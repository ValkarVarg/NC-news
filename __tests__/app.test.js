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

  describe("/api/articles/:article_id", () => {
    test("GET:200 sends an object with the requested article", () => {
      const result = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toMatchObject(result);
        });
    });
    test("returns a 404 Not Found when a valid but non-existing id is requested", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("returns a 400 Bad Request when an invalid id is requested", () => {
      return request(app)
        .get("/api/articles/banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });

  describe("/api/articles", () => {
    test("GET:200 sends an array of all articles to the client with a total number of comments", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(13);
          body.articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.total_comments).toBe("string");
          })
          expect(body.articles).toBeSortedBy("created_at", { coerce: true });
        });
    });
  });