import * as http from 'http';
import * as router from './router';

http.createServer(router.handleRequest).listen(8080);