import { Router } from 'express';

import UserController from './controllers/UserController';
import UserCreateValidation from './services/validations/UserCreateValidation';
import UserUpdatedValidation from './services/validations/UserUpdatedValidation';
import UserAuthentication from './services/authentication/UserAuthentication';

const routes = new Router();

routes.get('/user', UserController.list);
routes.post('/user', UserCreateValidation, UserController.create);
routes.post('/user/auth', UserController.auth);
routes.get('/user/auth/confirm-mail', UserController.confirmEmail);
routes.get('/user/:id', UserController.read);
routes.put(
  '/user/:id',
  UserAuthentication,
  UserUpdatedValidation,
  UserController.update
);
routes.delete('/user/:id', UserAuthentication, UserController.delete);

export default routes;
