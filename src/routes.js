import { Router } from 'express';

import UserController from './controllers/UserController';
import UserCreateValidation from './services/validations/UserCreateValidation';
import UserUpdatedValidation from './services/validations/UserUpdatedValidation';

const routes = new Router();

routes.post('/user', UserCreateValidation, UserController.create);
routes.get('/user/:id', UserController.read);
routes.put('/user/:id', UserUpdatedValidation, UserController.update);
routes.delete('/user/:id', UserController.delete);

export default routes;
