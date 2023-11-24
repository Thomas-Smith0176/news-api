const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");
const { totalEntries } = require("../utils");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({ articleData, commentData, topicData, userData });
});

describe("GET /api", () => {
  test("200: responds with an object describing all the available endpoints on your API", () => {

    const endpointsContents = require("../endpoints.json");
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

describe("POST /api/topics", () => {
  test("201: responds with a topic object added to the data base", () => {
    const newTopic = {
      slug: "topic name here",
      description: "description here"
    };
    return request(app)
    .post("/api/topics")
    .send(newTopic)
    .expect(201)
    .then((response) => {
      expect(response.body.topic).toMatchObject(
        {
          slug: "topic name here",
          description: "description here"
        }
      );
    });
  });
  test("400: responds with bad request when given an incomplete request body", () => {
    const newTopic = {
      slug: "topic name here",
    };
    return request(app)
    .post("/api/topics")
    .send(newTopic)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
  test("400: responds with bad request when given an invalid request body", () => {
    const newTopic = {
      slug: 1234,
      description: 5678
    };
    return request(app)
    .post("/api/topics")
    .send(newTopic)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
});
  
describe("GET /api/articles", () => {
  test("200: responds with an array of article objects sorted in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(10);
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

describe("GET api/articles (topic query)", () => {
  test("200: responds with an array of articles filtered by the given topic", () => {
    return request(app)
    .get("/api/articles?topic=cats")
    .expect(200)
    .then((response) => {
      response.body.articles.forEach((article) => {
        expect(article.topic).toBe("cats")
      })
      expect(response.body.articles.length).toBe(1)
    });
  });
  test("404: responds with not found when given an invalid query", () => {
    return request(app)
    .get("/api/articles?topic=1234")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not found")
    });
  });
});

describe("GET api/articles (author query)", () => {
  test("200: responds with an array of articles filtered by the given author", () => {
    return request(app)
    .get("/api/articles?author=rogersop")
    .expect(200)
    .then((response) => {
      response.body.articles.forEach((article) => {
        expect(article.author).toBe("rogersop")
      })
      expect(response.body.articles.length).toBe(3)
    });
  });
  test("200: responds with a filtered array when given multiple queries", () => {
    return request(app)
    .get("/api/articles?author=rogersop&&topic=mitch")
    .expect(200)
    .then((response) => {
      response.body.articles.forEach((article) => {
        expect(article.author).toBe("rogersop")
        expect(article.topic).toBe("mitch")
      })
      expect(response.body.articles.length).toBe(2)
    });
  });
  test("404: responds with not found when given an invalid query", () => {
    return request(app)
    .get("/api/articles?author=1234")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not found")
    });
  });
});

describe("GET /api/articles (sort_by and order queries)", () => {
  test("200: responds with an array of articles sorted according to sort_by and order queries", () => {
    return request(app)
    .get("/api/articles?sort_by=title&&order=asc")
    .expect(200)
    .then((response) => {
      expect(response.body.articles).toBeSortedBy("title", {descending: false})
    }); 
  });
  test("200: responds with a sorted and filtered array of articles when given multiple queries", () => {
    return request(app)
    .get("/api/articles?sort_by=title&&order=asc&&author=rogersop&&topic=mitch")
    .expect(200)
    .then((response) => {
      response.body.articles.forEach((article) => {
        expect(article.author).toBe("rogersop")
        expect(article.topic).toBe("mitch")
      });
      expect(response.body.articles.length).toBe(2)
      expect(response.body.articles).toBeSortedBy("title", {descending: false})
    });
  });
  test("400: responds with bad request when passed an invalid sort_by or order query", () => {
    return request(app)
    .get("/api/articles?sort_by=not_a_query&&order=asc DROP TABLE articles;")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
});

describe("GET /api/articles (pagination)", () => {
  test("200: responds with an array of articles of length equal to the given limit, offset by the page number", () => {
    return request(app)
    .get("/api/articles?limit=5&&p=2")
    .expect(200)
    .then((response) => {
      expect(response.body.articles.length).toBe(5)
      expect(response.body.total_count).toBe(13)
      expect(response.body.articles[0].article_id).toBe(5)
      expect(response.body.articles[4].article_id).toBe(4)
    });
  });
  test("400: responds with bad request when provided an invalid limit or page query", () => {
    return request(app)
    .get("/api/articles?limit=hello&&p=world")
    .expect(400)
    .then((respnse) => {
      expect(respnse.body.msg).toBe("Bad request");
    });
  });
});

describe("POST /api/articles", () => {
  test("201: responds with a new article object added to the database", () => {
    const newArticle = {
      author: "rogersop",
      title: "The perfect paper plane tutorial",
      body: "Step 1: Make a paper plane",
      topic: "paper",
      article_img_url: "https://i.scdn.co/image/ab67616d0000b2734f3fc8ea510be941de66f032"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(201)
    .then((response) => {
      expect(response.body.article).toMatchObject({
          author: "rogersop",
          title: "The perfect paper plane tutorial",
          body: "Step 1: Make a paper plane",
          topic: "paper",
          article_img_url: "https://i.scdn.co/image/ab67616d0000b2734f3fc8ea510be941de66f032",
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          comment_count: expect.any(Number)
      });
    });
  });
  test("400: responds with bad request when provided an incomplete request body", () => {
    const newArticle = {
      author: "rogersop",
      body: "Step 1: Make a paper plane",
      article_img_url: "https://i.scdn.co/image/ab67616d0000b2734f3fc8ea510be941de66f032"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
  test("400: responds with bad request when provided a complete but invalid request body", () => {
    const newArticle = {
      author: 1234,
      title: "The perfect paper plane tutorial",
      body: "Step 1: Make a paper plane",
      topic: [],
      article_img_url: "https://i.scdn.co/image/ab67616d0000b2734f3fc8ea510be941de66f032"
    }
    return request(app)
    .post("/api/articles")
    .send(newArticle)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  })
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
    .get("/api/articles/3")
    .expect(200)
    .then((response) => {
      expect(response.body.article.comment_count).toBe(2)
    })
  })
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: responds with no content", () => {
    return request(app)
    .delete("/api/articles/1")
    .expect(204)
  });
  test("404: responds with not found when given a non existent id", () => {
    return request(app)
    .delete("/api/articles/9999")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not found")
    });
  });
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

describe("GET /api/articles/:article_id/comments (pagination)", () => {
  test("200: responds with an array of comments of length equal to the given limit, offset by the page number", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=5&&p=1")
    .expect(200)
    .then((response) => {
      expect(response.body.comments.length).toBe(5)
      expect(response.body.comments[0].comment_id).toBe(5)
      expect(response.body.comments[4].comment_id).toBe(7)
    });
  });
  test("400: responds with bad request when provided an invalid limit or page query", () => {
    return request(app)
    .get("/api/articles/1/comments?limit=hello&&p=world")
    .expect(400)
    .then((respnse) => {
      expect(respnse.body.msg).toBe("Bad request");
    });
  });
})

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
  test("400: responds with Bad request when given an invalid article_id", () => {
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
    .patch("/api/articles/1")
    .send({ inc_votes: "banana"})
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
  test("404: responds with not found when given a valid article_id with no corresponding article", () => {
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

describe("GET /api/users", () => {
  test("200: responds with an array of all user objects", () => {
    return request(app)
    .get("/api/users")
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

describe("GET /api/users/:username", () => {
  test("200: responds with a user object corresponding to the given username", () => {
    return request(app)
    .get("/api/users/butter_bridge")
    .expect(200)
    .then((response) => {
      expect(response.body.user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        });
    });
  });
  test("404: responds with not found when given a non existent username", () => {
    return request(app)
    .get("/api/users/northcoder")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not found")
    });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: responds with a comment object with the votes propery updated", () => {
    const votes = {inc_votes: 10}
    return request(app)
    .patch("/api/comments/1")
    .send(votes)
    .expect(200)
    .then((response) => {
      expect(response.body.comment).toMatchObject(
        {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 26,
          author: "butter_bridge",
          article_id: 9,
          created_at: expect.any(String)
        }
      );
    });
  });
  test("400: responds with Bad request when given an invalid comment_id", () => {
    const votes = {inc_votes: 10}
    return request(app)
      .patch("/api/comments/banana")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: responds with not found when given a non existent comment_id", () => {
    const votes = {inc_votes: 10}
    return request(app)
    .patch("/api/comments/9999")
    .send(votes)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not found")
    });
  });
  test("400: responds with bad request when given an invalid or incomplete request body", () => {
    const votes = { wrong_body: "hello" }
    return request(app)
    .patch("/api/comments/1")
    .send(votes)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
  test("400: responds with bad request when given a complete request body with a non integar value", () => {
    const votes = { inc_votes: "hello" }
    return request(app)
    .patch("/api/comments/1")
    .send(votes)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request")
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: responds with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: responds with Bad request when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with bad request when given an invalid article_id", () => {
    return request(app)
    .delete("/api/articles/hello")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad request')
    });
  });
  test("404: responds with not found when given an id for a non existent comment", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      }); 
  })
});


///////////////////testing utils requiring db access///////////////////////

describe("totalEntries", () => {
  test("returns a number", () => {
    return totalEntries("articles")
    .then((response) =>
    expect(typeof response).toBe("number")
    );
  });
  test("returns the correct number of entries in the given table", () => {
    return totalEntries("articles")
    .then((response) =>
    expect(response).toBe(13)
    );
  });
});



