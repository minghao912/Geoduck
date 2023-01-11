import * as http from 'http';
import * as router from './router';
const PORT = 8070;
http.createServer(router.handleRequest).listen(PORT, '0.0.0.0');
