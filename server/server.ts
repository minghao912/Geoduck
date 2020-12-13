import * as http from 'http';
import * as router from './router';

http.createServer(router.handleRequest).listen(8080, '0.0.0.0');