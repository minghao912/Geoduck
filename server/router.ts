import * as url from 'url';
import * as fs from 'fs';
import * as test from './test/test';
import * as panda from './panda';
import * as panda_linux from './panda_linux';

function renderHTML(filepath: string, response): void {
    response.writeHead(200, {'Content-Type': 'text/html'});

    fs.readFile(filepath, null, (err, data) => {
        if (err) {
            response.writeHead(404);
            response.write('File not found: ' + filepath);
        } else {
            response.write(data);
        }
        response.end();
    });
}

export function handleRequest(request, response): void {
    const path = url.parse(request.url).pathname;
    const href = url.parse(request.url).href;   // includes ?xxx portion

    // Transfer all "/panda/xxx" requests to panda
    const pathSplit = path.split('/');
    let firstDirectory: string;
    if (pathSplit.length >= 1) {
        firstDirectory = pathSplit[1];

        // For "/panda/xxx"
        if (firstDirectory == 'panda')
            return panda.run(href, response);

        // For "/panda_linux/xxx"
        if (firstDirectory == 'panda_linux')
            return panda_linux.run(href, response);
    }

    // All other paths
    switch (path) {
        case '/':
            renderHTML('./test/index.html', response);
            break;
        case '/test':
            test.run(response);
            break;
        default:
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('File not found');
            response.end();
            break;
    }
}