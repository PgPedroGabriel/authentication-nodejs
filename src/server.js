import server from './app';
import './bootstrap';

server.listen(process.env.PORT || 4000);
console.log(`Running on PORT ${process.env.PORT}`);
