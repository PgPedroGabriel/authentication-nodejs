import request from 'supertest';
import '../../src/bootstrap';
import server from '../../src/app';

describe('UserController', () => {
  let userId = null;
  let token = null;
  it('Creating USER test', () => {
    const payload = {
      email: 'testtestestJEST@levetec.com.br',
      name: 'Pedro Gabriel',
      password: '123123123',
      passwordConfirm: '123123123',
      username: 'testtestestJEST'
    };

    return request(server)
      .post('/user')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        expect(response.body.id).not.toBeNull();
        userId = response.body.id;
      });
  });

  it('User exists validation', () => {
    const payload = {
      email: 'testtestestJEST@levetec.com.br',
      name: 'Pedro Gabriel',
      password: '123123123',
      passwordConfirm: '123123123',
      username: 'testtestestJEST'
    };

    return request(server)
      .post('/user')
      .send(payload)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('Incorrect password', () => {
    return request(server)
      .post('/user/auth')
      .send({
        username: 'testtestestJEST',
        password: 'xx'
      })
      .expect(401);
  });

  it('TEST User can be authenticated', () => {
    return request(server)
      .post('/user/auth')
      .send({
        username: 'testtestestJEST',
        password: '123123123'
      })
      .expect(200)
      .then(response => {
        expect(response.body.token).not.toBeNull();
        token = response.body.token;
      });
  });

  it('TEST User can be found', () => {
    return request(server)
      .get(`/user/${userId}`)
      .expect(200)
      .then(response => {
        expect(response.body.id).toBe(String(userId));
      });
  });

  it('Test user can be edited', () => {
    const payload = {
      email: 'changedTESTJESTUSER@gmail.com',
      name: 'Change Teste user Name',
      password: '3123131321',
      passwordConfirm: '23131331231',
      username: 'CHANGETESTUSERNAME'
    };

    return request(server)
      .put(`/user/${userId}`)
      .send(payload)
      .set('Authorization', token)
      .expect(200)
      .then(res => {
        expect(res.body.username).toBe(payload.username);
      });
  });

  it('TEST User created before can be deleted', () => {
    return request(server)
      .delete(`/user/${userId}`)
      .set('Authorization', token)
      .expect(200);
  });

  it('TEST User CANNOT be found', () => {
    return request(server)
      .get(`/user/${userId}`)
      .expect(404);
  });
});
