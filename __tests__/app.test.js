const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const fs = require("fs/promises");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        response.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(response.body.topics.length).toBe(3);
      });
  });
  test("404: reponds with Not found when given a non existent endpoint", () => {
    return request(app)
      .get("/api/nonExistentEndpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not found");
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object describing all the available endpoints on your API", () => {

    const endpointsContents = require('../endpoints.json');
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          Object.keys(response.body.endpoints).forEach((endpoint) => {
            expect(response.body.endpoints[endpoint]).toMatchObject({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
            });
          });
          expect(Object.keys(response.body.endpoints).length).toBe(
            Object.keys(endpointsContents).length
          );
        });
  });
  test("404: reponds with Not found when given a non existent endpoint", () => {
    return request(app)
      .get("/api/nonExistentEndpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("404: Not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects sorted in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article.hasOwnProperty("body")).toBe(false);
        });
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(response.body.articles[0].comment_count).toBe(2);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object corresponding to the correct ID", () => {
    const expected = {
      article_id: 1,
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
      .then((response) => {
        expect(response.body.article).toMatchObject(expected);
      });
  });
  test("400: responds with Bad request when given an invalid Id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: responds with Not found when given a non existent but valid id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("200: responds with an article object containing a comment_count property", () => {
    return request(app)
    .get('/api/articles/3')
    .expect(200)
    .then((response) => {
      expect(response.body.article.comment_count).toBe(2)
    })
  })
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with all comments for an article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(2);
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        response.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          });
        });
      });
  });
  test("400: responds with Bad request when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: responds with Not found when provided a valid article_id not corresponding to an article", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("200: responds with an empty array when given an article_id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a new posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello there",
    }
    
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          body: newComment.body,
          author: newComment.username,
          article_id: 2,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test('400: responds with Bad request when given an invalid article_id', () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello there",
    }
    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  
  test("400: responds with bad request when given an invalid request body", () => {
    return request(app)
    .patch('/api/articles/1')
    .send({ inc_votes: 'banana'})
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
  test('404: responds with not found when given a valid article_id with no corresponding article', () => {
    const newComment = {
      username: "butter_bridge",
      body: "Hello there",
    }
     return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("GET api/articles (topic query)", () => {
  test("200: responds with an array of articles filtered by the given topic", () => {
    return request(app)
    .get('/api/articles?topic=cats')
    .expect(200)
    .then((response) => {
      response.body.articles.forEach((article) => {
        expect(article.topic).toBe('cats')
      })
      expect(response.body.articles.length).toBe(1)
    });
  });
  test("404: responds with not found when given an invalid query", () => {
    return request(app)
    .get('/api/articles?topic=1234')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Not found')
    });
  });
});

describe("GET api/articles (sort_by and order queries)", () => {
  test("200: responds with an array of articles sorted according to sort_by and order queries", () => {
    return request(app)
    .get('/api/articles?sort_by=title&&order=asc')
    .expect(200)
    .then((response) => {
      expect(response.body.articles).toBeSortedBy('title', {descending: false})
    }); 
  });
  test("400: responds with bad request when passed an invalid sort_by or order query", () => {
    return request(app)
    .get('/api/articles?sort_by=not_a_query&&order=asc DROP TABLE articles;')
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request')
    });
  });
});

describe('GET /api/users', () => {
  test('200: responds with an array of all user objects', () => {
    return request(app)
    .get('/api/users')
    .expect(200)
    .then((response) => {
      response.body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      });
      expect(response.body.users.length).toBe(4)
    });
  });
});

