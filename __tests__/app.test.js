const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data')

afterAll(()=> {
    return db.end()
});

beforeEach(() => {
   return seed({articleData, commentData, topicData, userData})
})

describe('GET /api/topics', ()=> {
    test('200: responds with an array of topic objects', ()=> {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            response.body.topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            });
        });
    });
});