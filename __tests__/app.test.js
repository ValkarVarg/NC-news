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
      comment_count: 11,
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(result);
      });
  });
  test("GET:200 works on an article with no comments", () => {
    const result = {
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: "2020-10-16T05:03:00.000Z",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      comment_count: 0,
    };
    return request(app)
      .get("/api/articles/2")
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
        expect(body.articles.length).toBe(10);
        expect(body.total_count).toBe(13)
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
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
        expect(body.articles.length).toBe(10);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(article.topic).toBe("mitch");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
        expect(body.articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("GET:200 Topic query filters to an empty array when given a valid but non-existant query", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("returns a 400 Bad Request when an unallowed query is requested", () => {
    return request(app)
      .get("/api/articles?InvalidQuery=invalidquery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("returns a 404 Not Found when an topic that doesn't exist is requested", () => {
    return request(app)
      .get("/api/articles?topic=invalidquery")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource Not Found");
      });
  });
  test("GET:200 sort_by query sorts the articles by the inputted query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          coerce: true,
          descending: true,
        });
      });
  });
  test("returns a 400 Bad Request when an column that doesn't exist is sorted by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalidColumn")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:200 order query sorts the articles by the inputted query", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: false,
        });
      });
  });
  test("returns a 400 Bad Request when ordered by an invalid argument", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("GET:200 works with multiple queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", {
          coerce: true,
          descending: false,
        });
        body.articles.forEach((article) => {
        expect(article.topic).toBe("mitch");})
      });
  });
  test("GET:200 returns limited based on the limit query", () => {
    return request(app)
      .get("/api/articles?limit=12")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
      });
    });
    test("GET:200 returns paged based on p query", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBe(3);
        });
      });
      test("GET:200 can combine limit and p", () => {
        return request(app)
          .get("/api/articles?limit=4&p=4")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(1);
          });
        });
        test("GET:200 if limit is not a number, uses default value", () => {
          return request(app)
            .get("/api/articles?limit=invalid")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(10);
            });
          });
          test("GET:200 if page is not a number, uses default value", () => {
            return request(app)
              .get("/api/articles?p=invalid")
              .expect(200)
              .then(({ body }) => {
                expect(body.articles.length).toBe(10);
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
          comment_id: 19,
          body: "This is a comment",
          article_id: 2,
          author: "rogersop",
          votes: 0,
        });
        expect(typeof body.comment.created_at).toBe("string");
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
          article_id: 1,
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
  test("returns a 400 Bad Request when an invalid id is requested", () => {
    return request(app)
      .delete("/api/comments/invalidId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users", () => {
  test("GET:200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET:200 sends the chosen user to the client", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
          expect(body.user.username).toBe("rogersop");
          expect(body.user.name).toBe("paul");
          expect(body.user.avatar_url).toBe('https://avatars2.githubusercontent.com/u/24394918?s=400&v=4');
        });
      });
      test("returns a 404 Not Found when a non existent username is requested", () => {
        return request(app)
          .delete("/api/users/valkarvarg")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Route Not Found");
          });
      });
  });

  describe("PATCH /api/commentss/:commentId", () => {
    test("PATCH returns a 200 and the updated comment with votes", () => {
      const votes = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(votes)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 17,
            author: "butter_bridge",
            article_id: 9,
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
    });
    test("PATCH returns a 400 and bad request when insufficient info provided", () => {
      const votes = {};
      return request(app)
        .patch("/api/comments/1")
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
        .patch("/api/comments/9999999")
        .send(votes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource Not Found");
        });
    });
    test("PATCH returns a 400 and bad request when comment_id invalid", () => {
      const votes = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/comments/invalidId")
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
        .patch("/api/comments/1")
        .send(votes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  })

  describe("POST /api/articles/", () => {
    test("POST returns a 201 and the article successfully added", () => {
      const article = {
        author: "rogersop",
        title: "Article",
        body: "This is an article",
        topic: "paper",
        article_img_url: "https://media.istockphoto.com/id/178580846/photo/large-stack-of-papers-on-a-white-background.jpg?s=612x612&w=0&k=20&c=-Ou5GiHRMr3JiXPuH7uHfPrLCgbW15FEYwxEe86se58="
      };
      return request(app)
        .post("/api/articles/")
        .send(article)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 14,
            author: "rogersop",
            title: "Article",
            body: "This is an article",
            topic: "paper",
            votes: 0,
            comment_count: 0,
            article_img_url: "https://media.istockphoto.com/id/178580846/photo/large-stack-of-papers-on-a-white-background.jpg?s=612x612&w=0&k=20&c=-Ou5GiHRMr3JiXPuH7uHfPrLCgbW15FEYwxEe86se58="
          });
          expect(typeof body.article.created_at).toBe("string");
        });
    });
    test("POST returns a 201 and default vlaue for article_img_url if not provided", () => {
      const article = {
        author: "rogersop",
        title: "Article",
        body: "This is an article",
        topic: "paper"
              };
      return request(app)
        .post("/api/articles/")
        .send(article)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: 14,
            author: "rogersop",
            title: "Article",
            body: "This is an article",
            topic: "paper",
            votes: 0,
            comment_count: 0,
            article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
          });
          expect(typeof body.article.created_at).toBe("string");
        });
    });
    test("POST returns a 400 and bad request when insufficient info provided", () => {
      const article = {
      };
      return request(app)
        .post("/api/articles/")
        .send(article)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("POST returns a 404 and Resource Not Found when topic doesn't exist", () => {
      const article = {
        author: "rogersop",
        title: "Article",
        body: "This is an article",
        topic: "invalidTopic"
      };
      return request(app)
        .post("/api/articles/")
        .send(article)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource Not Found");
        });
    });
    test("POST returns a 404 and Resource Not Found when user doesn't exist", () => {
      const article = {
        author: "madeUpUser",
        title: "Article",
        body: "This is an article",
        topic: "paper"
      };
      return request(app)
        .post("/api/articles/")
        .send(article)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource Not Found");
        });
    });
  });