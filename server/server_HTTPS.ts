import * as https from 'https';
import * as fs from 'fs';
import * as router from './router';

// SSL stuff
const options = {
    key: fs.readFileSync("/etc/ssl/cloudflare/cert.key"),
    cert: fs.readFileSync("/etc/ssl/cloudflare/cert.pem")
};

https.createServer(options, router.handleRequest).listen(8443, '0.0.0.0');