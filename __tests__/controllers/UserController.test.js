import request from 'supertest';
import '../../src/bootstrap';
import server from '../../src/app';

describe('UserController', () => {
  let userId = null;
  let token = null;
  let confirmationMailToken = null;

  test('Creating USER test', (done) => {
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
        expect(response.body.email_confirmation_token).not.toBeUndefined();
        expect(response.body.email_confirmation).not.toBeTruthy();
        userId = response.body.id;
        confirmationMailToken = response.body.email_confirmation_token;
        done();
      })
  });

  test('User exists validation', (done) => {
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
      .expect(400)
      .then(() => done() );
  });

  test('Incorrect password', (done) => {
    return request(server)
      .post('/user/auth')
      .send({
        username: 'testtestestJEST',
        password: 'xx'
      })
      .expect(401)
      .then(() => done() );
  });

  test('TEST user cannot be authenticated because no actives username by email', (done) => {
    return request(server)
      .post('/user/auth')
      .send({
        username: 'testtestestJEST',
        password: '123123123'
      })
      .expect(401)
      .then(response => {
        expect(response.body.error).not.toBeNull();
        done();
      })
  });

  test('TEST user can generated TOKEN of validation email wtesth success', (done) => {
    return request(server)
      .get(
        `/user/auth/confirm-mail/${encodeURIComponent(confirmationMailToken)}`
      )
      .expect(200)
      .then(response => {
        expect(response.body.token).not.toBeUndefined();
        done();
      })
  });

  test('TEST user verified email wtesth success', (done) => {
    return request(server)
      .put(`/user/auth/verify/${encodeURIComponent(confirmationMailToken)}`)
      .expect(200)
      .then(() => done() );
  });

  test('TEST User can be authenticated', (done) => {
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
        done();
      })
  });

  test('TEST User can be found', (done) => {
    return request(server)
      .get(`/user/${userId}`)
      .expect(200)
      .then(response => {
        expect(response.body.id).toBe(String(userId));
        done();
      })
  });

  test('Test user CANT be authenticated because we sending a invalid token', (done) => {
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
      .set('Authorization', 'x')
      .expect(401)
      .then(() => done() );
  });

  test('Test user can be authenticated', (done) => {
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
        done();
      });
  });

  test('TEST User created before can be deleted', (done) => {
    return request(server)
      .delete(`/user/${userId}`)
      .set('Authorization', token)
      .expect(200).then(() => done() );
  });

  test('TEST User CANNOT be found', (done) => {
    return request(server)
      .get(`/user/${userId}`)
      .expect(404).then(() => done() );
  });
});
