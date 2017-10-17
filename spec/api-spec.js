/* eslint-disable no-console */
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'test';
require('dotenv').config({ path: `./.${process.env.NODE_ENV}.env` });

const { expect } = require('chai');
const request = require('supertest');
const server = require('../server');
const mongoose = require('mongoose');
const saveTestData = require('../seed/test.seed');
// const config = require('../config');
// const db = config.DB[process.env.NODE_ENV] || process.env.DB;

const db = process.env.DB_URI;

describe('API', () => {
  let usefullIds;
  before((done) => {
    mongoose.connection.dropDatabase()
      .then(() => saveTestData(db, (err, ids) => {
        if (err) throw err;
        usefullIds = ids;
        done();
      }));
  });

  describe('GET /', () => {
    it('responds with status code 200', () => {
      return request(server)
        .get('/')
        .then(res => {
          expect(res.status).to.equal(200);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/topics', () => {
    it('responds with all topics', () => {
      return request(server)
        .get('/api/topics')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.topics.length).to.equal(3);
        })
        .catch(err => {
          throw err;
        });
    });
  });  

  describe('GET /api/topics/:topic_id/articles', () => {
    it('responds with all articles for a particular topic', () => {
      return request(server)
        .get('/api/topics/cats/articles')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(typeof res.body.articles[0].belongs_to).to.equal('string');
          expect(res.body.articles.length).to.equal(1);
          expect(typeof res.body.articles[0].title).to.equal('string');
          expect(res.body.articles[0].comments).to.be.a('number');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 404 if topic doesnt exist', () => {
      return request(server)
        .get('/api/topics/cooking/articles')
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('No Articles found for topic cooking');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/articles', () => {
    it('responds with all articles', () => {
      return request(server)
        .get('/api/articles')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0].comments).to.be.a('number');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/articles/:article_id', () => {
    it('responds with the article record for a particular article id', () => {
      return request(server)
        .get(`/api/articles/${usefullIds.article_id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(typeof res.body.article.title).to.equal('string');
          expect(res.body.article.comments).to.be.a('number');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 404 if article doesnt exist', () => {
      const articleId = usefullIds.comment_id;
      return request(server)
        .get(`/api/articles/${articleId}`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not Found');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 422 if the article id is invalid', () => {
      return request(server)
        .get('/api/articles/fakeid')
        .then(res => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Invalid Article Id');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('PUT /api/articles/:article_id?vote=[up/down]', () => {
    it('should increment the votes of an article by one', () => {
      return request(server)
        .put(`/api/articles/${usefullIds.article_id}?vote=up`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.article.votes).to.equal(1);
        })
        .catch(err => {
          throw err;
        });
    });

    it('does not update the vote of an article if vote query is invalid', () => {
      return request(server)
        .put(`/api/articles/${usefullIds.article_id}?vote=notupordown`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.article.votes).to.equal(1);
        })
        .catch(err => {
          throw err;
        });
    });

    it('should decrement the votes of an article by one', () => {
      return request(server)
        .put(`/api/articles/${usefullIds.article_id}?vote=down`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.article.votes).to.equal(0);
        })
        .catch(err => {
          throw err;
        });
    });

    it('does not decrement the votes of an article if already equal to zero', () => {
      return request(server)
        .put(`/api/articles/${usefullIds.article_id}?vote=down`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.article.votes).to.equal(0);
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 404 if article doesnt exist', () => {
      const articleId = usefullIds.comment_id;
      return request(server)
        .put(`/api/articles/${articleId}?vote=down`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not Found');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 422 if the article id is invalid', () => {
      return request(server)
        .put(`/api/articles/fakeId?vote=up`)
        .then(res => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Invalid Article Id');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/articles/:article_id/comments', () => {
    it('responds with all comments for a particular article', () => {
      return request(server)
        .get(`/api/articles/${usefullIds.article_id}/comments`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.comments.length).to.equal(2);
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 404 if article doesnt exist', () => {
      const article_id = usefullIds.comment_id;
      return request(server)
        .get(`/api/articles/${article_id}/comments`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Comments Not Found');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 422 if the article id is invalid', () => {
      return request(server)
        .get('/api/articles/fakeid/comments')
        .then(res => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Invalid Article Id');
        })
        .catch(err => {
          throw err;
        });
    });
  });
  
  describe('POST /api/articles/:article_id/comments', () => {
    it('creates a new comment for a particular article', () => {
      return request(server)
        .post(`/api/articles/${usefullIds.article_id}/comments`)
        .send({ body: 'test' })
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.comment._id).to.not.equal(undefined);
          expect(res.body.comment.body).to.equal('test');
        })
        .catch(err => {
          throw err;
        });
    });

    it('provides appropriate error message if article doesnt exist for the comment to be added', () => {
      const article_id = usefullIds.comment_id;
      return request(server)
        .post(`/api/articles/${article_id}/comments`)
        .send({ body: 'test' })
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article Not Found, cannot add comment');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 422 if the article id is invalid', () => {
      return request(server)
        .post('/api/articles/fakeid/comments')
        .send({ body: 'test' })
        .then(res => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Invalid Article Id, cannot add comment');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/comments', () => {
    it('responds with all comments', () => {
      return request(server)
        .get('/api/comments')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.comments.length).to.equal(3);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/comments/:comment_id', () => {
    it('responds with the comment record for a particular comment id', () => {
      return request(server)
        .get(`/api/comments/${usefullIds.comment_id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(typeof res.body.comment.body).to.equal('string');
          expect(res.body.comment.created_by).to.equal('northcoder');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 404 if comment doesnt exist', () => {
      let commentId = usefullIds.article_id;
      return request(server)
        .get(`/api/comments/${commentId}`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Comment Not Found');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 422 if the comment id is invalid', () => {
      return request(server)
        .get('/api/comments/fakeid/')
        .then(res => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Invalid Comment Id');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('PUT /api/comments/:comment_id?vote=[up/down]', () => {
    it('Increments the vote of a particular comment by one', () => {
      return request(server)
        .put(`/api/comments/${usefullIds.comment_id}?vote=up`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.comment.votes).to.equal(1);
        })
        .catch(err => {
          throw err;
        });
    });

    it('does not update the vote of a comment if vote query is invalid', () => {
      return request(server)
        .put(`/api/comments/${usefullIds.comment_id}?vote=notupordown`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.comment.votes).to.equal(1);
        })
        .catch(err => {
          throw err;
        });
    });

    it('Decrements the vote of a particular comment by one', () => {
      return request(server)
        .put(`/api/comments/${usefullIds.comment_id}?vote=down`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.comment.votes).to.equal(0);
        })
        .catch(err => {
          throw err;
        });
    });

    it('does not decrement the votes of a comment if already equal to zero', () => {
      return request(server)
        .put(`/api/comments/${usefullIds.comment_id}?vote=down`)
        .then(res => {
          expect(res.status).to.equal(201);
          expect(res.body.comment.votes).to.equal(0);
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 404 if comment doesnt exist', () => {
      const commentId = usefullIds.article_id;
      return request(server)
        .put(`/api/comments/${commentId}?vote=down`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Comment Not Found');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 422 if the comment id is invalid', () => {
      return request(server)
        .put(`/api/comments/fakeid?vote=up`)
        .then(res => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Comment Id Invalid');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('DELETE /comments/:comment_id', () => {
    it('Deletes a comment from the database', () => {
      return request(server)
        .delete(`/api/comments/${usefullIds.comment_id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Comment deleted!');
        })
        .catch(err => {
          throw err;
        });
    });

    it('Provides appropriate error message if comment doesnt exist', () => {
      return request(server)
        .delete(`/api/comments/${usefullIds.comment_id}`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Comment doesnt exist!');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 422 if the comment id is invalid', () => {
      return request(server)
        .delete('/api/comments/fakeid')
        .then(res => {
          expect(res.status).to.equal(422);
          expect(res.body.message).to.equal('Invalid Comment Id');
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/users', () => {
    it('responds with all user profile records', () => {
      return request(server)
        .get('/api/users')
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.users.length).to.equal(1);
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('GET /api/users/:username', () => {
    it('responds with the user profile record for a particular username', () => {
      let userName = 'northcoder';
      return request(server)
        .get(`/api/users/${userName}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(typeof res.body.user.name).to.equal('string');
        })
        .catch(err => {
          throw err;
        });
    });

    it('responds with 404 if username doesnt exist', () => {
      let userName = 'northcoderSSS';
      return request(server)
        .get(`/api/users/${userName}`)
        .then(res => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('User Not Found');
        })
        .catch(err => {
          throw err;
        });
    });
  });

});