import { Router } from 'express';

import UserController from './controllers/UserController';
import UserCreateValidation from './services/validations/UserCreateValidation';

const routes = new Router();

routes.post('/user', UserCreateValidation, UserController.create);
routes.get('/user/:id', UserController.read);

export default routes;
