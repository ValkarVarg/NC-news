const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("general api errors", () => {
  test("returns a 404 Not Found when an invalid endpoint is requested", () => {
    return request(app)
      .get("/api/invalidendpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route Not Found");
      });
  });
});

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
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
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
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
        });
        expect(body.articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("GET:200 Topic query filters the articles based on topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.total_comments).toBe("string");
        });
        expect(body.articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("GET:200 Topic query filters to an empty array when given a valid but non-existant query", () => {
    return request(app)
      .get("/api/articles?topic=nonexistanttopic")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
      });
  });
  test("returns a 400 Bad Request when an invalid query is requested", () => {
    return request(app)
      .get("/api/articles?InvalidQuery=invalidquery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/articles/:articleId/comments", () => {
  test("GET:200 sends an array of all comments on the specified article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
        expect(body.comments).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("GET:200 works when there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("returns a 404 Not Found when a valid but non-existing id is requested", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
  test("returns a 400 Bad Request when an invalid id is requested", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:articleId/comments", () => {
  test("POST returns a 201 and the comment successfully added", () => {
    const comment = {
      username: "rogersop",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          "comment_id": 19,
          "body": "This is a comment",
          "article_id": 2,
          "author": "rogersop",
          "votes": 0,
        });
        expect(typeof body.comment.created_at).toBe("string")
      });
  });
  test("POST returns a 400 and bad request when insufficient info provided", () => {
    const comment = {
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST returns a 404 and resource not found when article_id doesn't exist", () => {
    const comment = {
      username: "rogersop",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/9999999/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
  test("POST returns a 400 and bad request when article_id invalid", () => {
    const comment = {
      username: "rogersop",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/invalidId/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("POST returns a 404 and resource not found when user doesn't exist", () => {
    const comment = {
      username: "MadeUpUser",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
    });
});

describe("PATCH /api/articles/:articleId", () => {
  test("PATCH returns a 200 and the updated article with votes", () => {
    const votes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH returns a 400 and bad request when insufficient info provided", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH returns a 404 and resource not found when article_id doesn't exist", () => {
    const votes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/9999999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
  test("PATCH returns a 400 and bad request when article_id invalid", () => {
    const votes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/invalidId")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH returns a 400 and bad request when inc_votes is not a number", () => {
    const votes = {
      inc_votes: "invalidNumber",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:commentId", () => {
  test("DELETE returns a 204", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/articles/9/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(1);
          });
      });
  });
  test("returns a 404 Not Found when a valid but non-existing id is requested", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
});
test("returns a 400 Not Found when an invalid id is requested", () => {
  return request(app)
    .delete("/api/comments/invalidId")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});
})

describe("/api/users", () => {
  test("GET:200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        console.log(body)
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});