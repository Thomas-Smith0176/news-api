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
    const endpointsContents = fs.readFile(`${__dirname}/../endpoints.json`)
    return Promise.all([endpointsContents])
      .then((endpointsContents) => {
        const endpointsActual = JSON.parse(endpointsContents)
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            Object.keys(response.body.endpoints).forEach((endpoint) => {
                expect(response.body.endpoints[endpoint]).toMatchObject({
                    description: expect.any(String),
                    queries: expect.any(Array),
                    exampleResponse: expect.any(Object)
                  });
            })
            expect(Object.keys(response.body.endpoints).length).toBe(Object.keys(endpointsActual).length)
        });
    });
});
test('404: reponds with Not found when given a non existent endpoint', () => {
    return request(app)
    .get('/api/nonExistentEndpoint')
    .expect(404)
    .then((response) => {
        expect(response.body.msg).toBe('404: Not found')
    });
});
})


describe('GET /api/articles/:article_id', () => {
    test('200: responds with an article object corresponding to the correct ID', () => {
        const expected = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            expect(response.body.article).toEqual(expected)
        })
    })
})
