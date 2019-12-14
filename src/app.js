import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandling();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(express.static(path.join(process.cwd(), 'public')));
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandling() {
    this.server.use((err, req, res) => {
      return res.status(500).send({ error: 'Erro interno' });
    });
  }
}

export default new App().server;
