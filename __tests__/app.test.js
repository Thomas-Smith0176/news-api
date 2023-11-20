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
      })
  });
});
describe('GET /api/articles', () => {
    test('200: responds with an array of article objects sorted in descending order by date', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            expect(response.body.articles.length).toBe(13)
            response.body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    created_at: expect.any(String),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                });
                expect(article.hasOwnProperty('body')).toBe(false)
            });
            expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
            expect(response.body.articles[0].comment_count).toBe(2)
        });
    });
});
